import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import ApiError from "../exceptions/apiError";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      recoveryToken: token,
      recoveryTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(ApiError.BadRequest("Неверный или истёкший токен"));
    }

    next();
  } catch (e) {
    next(e);
  }
};
