import { model, Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  roles: string[];
  avatar: string | null;
  balance: number;
  level: number;
  exp: number;
  socketId: string | null;
  createdAt: Date;
}

const User = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  roles: [{ type: String, ref: "Role" }],
  avatar: { type: String, default: null },
  balance: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  socketId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now() },
});

export default model<IUser>("User", User);
