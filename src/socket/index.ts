import { Server, Socket } from "socket.io";
import { socketService } from "../services/socketService";

export default (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("init", (userId: string) =>
      socketService.handleInit(socket, userId)
    );

    socket.on("disconnect", () => {
      socketService.handleDisconnect(socket);
    });
  });
};
