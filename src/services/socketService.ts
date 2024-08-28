import { Socket } from "socket.io";
import User from "../models/User";

class SocketService {
  async handleInit(socket: Socket, userId: string): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { _id: userId },
        { $set: { socketId: socket.id } }
      );
    } catch (e) {
      console.error("Error updating user socketId", e);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { $set: { socketId: null } }
      );
    } catch (e) {
      console.error("Error updating user socketId", e);
    }
  }
}

export const socketService = new SocketService();
