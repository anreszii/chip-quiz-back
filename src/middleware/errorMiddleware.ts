import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/apiError";

export default (e: any[], req: Request, res: Response, next: NextFunction) => {
  console.log(e);
  if (e instanceof ApiError) {
    return res.status(e.status).json({ message: e.message, errors: e.errors });
  }
  return res.status(500).json({ message: "Server Error" });
};
