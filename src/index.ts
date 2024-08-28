import loadEnv from "./config/dotenv";
loadEnv();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import errorMiddleware from "./middleware/errorMiddleware";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import socketHandler from "./socket";

const app = express();
const PORT = process.env.PORT!;
const MONGODB_URI = process.env.MONGO_URI!;
const server = http.createServer(app);
const io = new Server(server);

socketHandler(io);

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Ошибка подключения к MongoDB:"));
db.once("open", () => {
  console.log("Подключение к MongoDB установлено");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
