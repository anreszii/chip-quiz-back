declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_REGION: string;
    S3_BUCKET: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
  }
}
