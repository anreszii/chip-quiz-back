import { model, Schema } from "mongoose";

export interface IRole extends Document {
  _id: Schema.Types.ObjectId;
  role: string;
}

const Role = new Schema<IRole>({
  role: { type: String, unique: true, default: "USER" },
});

export default model<IRole>("Role", Role);
