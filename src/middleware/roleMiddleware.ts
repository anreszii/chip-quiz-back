import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }

    try {
      const { roles: userRoles } = jwt.verify(
        token,
        process.env.ACCESS_SECRET
      ) as { roles: string[] };

      const hasRole = userRoles.some((role) => roles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ message: "У пользователя нет доступа" });
      }

      next();
    } catch {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
  };
};
