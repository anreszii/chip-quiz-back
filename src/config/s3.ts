import { S3 } from "aws-sdk";
import multer from "multer";

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey:
    process.env.S3_SECRET_ACCESS_KEY,
  endpoint: "https://s3.timeweb.cloud",
  region: "ru-1",
});

const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("image");

export default s3;
