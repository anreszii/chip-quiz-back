import dotenv from "dotenv";

const loadEnv = (): void => {
  dotenv.config({ path: "./.env" });
};

export default loadEnv;
