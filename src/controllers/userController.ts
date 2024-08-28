import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import ApiError from "../exceptions/apiError";
import { Types } from "mongoose";
import { authService } from "../services/authService";
import { uploadService } from "../services/uploadService";
import bcrypt from "bcryptjs";
import { userService } from "../services/userService";
import UserDTO from "../dtos/UserDTO";

interface IUpdateUser {
  password?: string;
  email?: string;
  avatar?: string;
  interests?: Types.ObjectId[];
}

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params;

      const user = await userService.getUserFromCache(userId);

      return res.json({ user: new UserDTO(user) });
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params;
      const { email, nowPassword, password } = req.body;
      const file = req.file;

      const user = await userService.findUserById(userId);

      const updateFields: IUpdateUser = {};
      if (email) updateFields.email = email;
      if (file) {
        const avatar = await uploadService.uploadImage(file, next);
        updateFields.avatar = avatar;
      }
      if (nowPassword && password) {
        await authService.verifyPassword(nowPassword, user.password);
        updateFields.password = await bcrypt.hash(password, 7);
      }

      if (Object.keys(updateFields).length === 0) {
        return next(ApiError.BadRequest("No fields to update"));
      }

      await User.updateOne({ _id: userId }, { $set: updateFields });

      await userService.updateUserCache(userId);

      return res.json({ message: "User updated successfully" });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
