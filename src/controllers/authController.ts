import { authService } from "../services/authService";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import ApiError from "../exceptions/apiError";
import { mailerService } from "../services/mailerService";
import bcrypt from "bcryptjs";

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      authService.handleValidationErrors(req, next);

      const { username, email, password } = req.body;

      const registrationData = await authService.registration(
        username,
        password,
        email
      );

      return res.json(registrationData);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      authService.handleValidationErrors(req, next);
      const { username, password, deviceId } = req.body;
      const userData = await authService.login(username, password, deviceId);
      authService.setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      authService.setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logout" });
    } catch (e) {
      next(e);
    }
  }

  async sendReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return next(ApiError.BadRequest("Пользователь не найден"));
      }

      const e = await mailerService.sendMail({
        to: email,
        from: "noreply@myotaku.fun",
        subject: "Сброс пароля",
        text: "Ссылка для сброса пароля: ",
      });

      if (e) {
        return next(e);
      }

      return res.json({ message: "Send" });
    } catch (e) {
      next(e);
    }
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return next(ApiError.BadRequest("Пользователь не найден"));
      }

      const hashPassword = await bcrypt.hash(newPassword, 7);

      await user.updateOne({ password: hashPassword });

      return res.json({ message: "Reset" });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
