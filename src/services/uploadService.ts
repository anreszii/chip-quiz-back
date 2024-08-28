import { NextFunction } from "express";
import s3 from "../config/s3";
import ApiError from "../exceptions/apiError";

class UploadService {
  async uploadImage(file: Express.Multer.File | undefined, next: NextFunction) {
    try {
      if (!file) {
        throw ApiError.BadRequest("Файл не найден");
      }

      const key = `${Date.now()}_${file.originalname}`;

      const params = {
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      await s3.upload(params).promise();

      return `https://s3.timeweb.cloud/20dedb32-d1a88cd6-a3d6-4342-ac89-562daf2d8679/${key}`;
    } catch (e) {
      next(e);
    }
  }
}

export const uploadService = new UploadService();
