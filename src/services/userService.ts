import User, { IUser } from "../models/User";
import ApiError from "../exceptions/apiError";
import { storageService } from "./storageService";
import { Schema } from "mongoose";

class UserService {
  async findUserById(userId: string | Schema.Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    return user;
  }

  async updateUserCache(userId: string | Schema.Types.ObjectId) {
    const user = await this.findUserById(userId);
    await storageService.setToCache(
      `user:${userId}`,
      JSON.stringify(user),
      86400
    );
  }

  async getUserFromCache(userId: string): Promise<IUser> {
    const cacheKey = `user:${userId}`;
    let user = await storageService.getFromCache(cacheKey);

    if (user) {
      return JSON.parse(user);
    }

    await this.updateUserCache(userId);
    user = await storageService.getFromCache(cacheKey);

    return JSON.parse(user!);
  }
}

export const userService = new UserService();
