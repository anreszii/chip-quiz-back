import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import { tokenService } from "./tokenService";
import UserDTO from "../dtos/UserDTO";
import ApiError from "../exceptions/apiError";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { storageService } from "./storageService";
import Role, { IRole } from "../models/Role";
import { userService } from "./userService";

interface IUserData {
  username: string;
  password: string;
  roles: string[];
  email: string;
}

class AuthService {
  async registration(username: string, password: string, email: string) {
    await this.checkIfUserExists(username, email);
    const hashPassword = await bcrypt.hash(password, 7);

    const getRole = async () => {
      const cachedKey = "roles";
      const cachedRoles = await storageService.getFromCache(cachedKey);

      if (cachedRoles) {
        const roles = JSON.parse(cachedRoles) as IRole[];

        return roles.find((el) => el.role === "USER")?.role || "USER";
      } else {
        const roles = await Role.find();

        await storageService.setToInfinityCache(
          cachedKey,
          JSON.stringify(roles)
        );

        return roles.find((el) => el.role === "USER")?.role || "USER";
      }
    };

    const role = await getRole();

    const userData: IUserData = {
      username,
      password: hashPassword,
      roles: [role],
      email,
    };

    const createUser = await User.create(userData);

    await userService.updateUserCache(createUser._id);

    return { message: "Регистрация прошла успешно" };
  }

  async login(username: string, password: string, deviceId: string) {
    const user = await this.findUserByUsername(username);
    await this.verifyPassword(password, user.password);
    const tokens = this.generateAndSaveTokens(user, deviceId);

    return {
      ...tokens,
      user,
    };
  }

  async logout(refreshToken: string) {
    await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(tokenFromDb.userId);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tokens = this.generateAndSaveTokens(user, tokenFromDb.deviceId);
    return {
      ...tokens,
      user: new UserDTO(user),
    };
  }

  private async checkIfUserExists(username: string, email?: string) {
    const promises = [User.findOne({ username })];
    if (email) {
      promises.push(User.findOne({ email }));
    }

    const [candidateName, candidateEmail] = await Promise.all(promises);

    if (candidateName) {
      throw ApiError.BadRequest(
        `Пользователь с таким именем пользователя уже существует`
      );
    }

    if (email && candidateEmail) {
      throw ApiError.BadRequest(
        `Пользователь с таким почтовым адресом уже существует`
      );
    }
  }

  private async findUserByUsername(username: string) {
    const user = await User.findOne({ username });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return user;
  }

  public async verifyPassword(password: string, hashedPassword: string) {
    const isPassEquals = await bcrypt.compare(password, hashedPassword);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
  }

  private generateAndSaveTokens(user: IUser, deviceId: string) {
    const tokens = tokenService.generateTokens({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
    tokenService.saveToken(user._id, deviceId, tokens.refreshToken);
    return tokens;
  }

  public handleValidationErrors(req: Request, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
    }
  }

  public setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
}

export const authService = new AuthService();
