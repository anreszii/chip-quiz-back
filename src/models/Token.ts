import { Document, model, Schema } from "mongoose";

interface IToken extends Document {
  _id: Schema.Types.ObjectId;
  deviceId: string;
  userId: Schema.Types.ObjectId;
  refreshToken: string;
}

const Token = new Schema<IToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  deviceId: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export default model("Token", Token);
