import { IUser } from "../models/User";
import { Schema } from "mongoose";

export default class UserDTO {
  id: Schema.Types.ObjectId;
  username: string;
  email: string;
  avatar: string | null;
  balance: number;
  level: number;
  exp: number;
  createdAt: Date;

  constructor(user: IUser) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.avatar = user.avatar;
    this.level = user.level;
    this.balance = user.balance;
    this.exp = user.exp;
    this.createdAt = user.createdAt;
  }
}
