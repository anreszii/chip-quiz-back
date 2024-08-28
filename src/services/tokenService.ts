import Token from "../models/Token";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

interface IPayload {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
}

class TokenService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor() {
    this.accessSecret = process.env.ACCESS_SECRET!;
    this.refreshSecret = process.env.REFRESH_SECRET!;
  }

  generateTokens(payload: IPayload) {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: "24h",
    });
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(
    userId: Schema.Types.ObjectId,
    deviceId: string,
    refreshToken: string
  ) {
    const tokenData = await Token.findOne({ userId, deviceId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return Token.create({ userId, deviceId, refreshToken });
  }

  async removeToken(refreshToken: string) {
    await Token.deleteOne({ refreshToken });
  }

  async validateAccessToken(accessToken: string) {
    return this.validateToken(accessToken, this.accessSecret);
  }

  async validateRefreshToken(refreshToken: string) {
    return this.validateToken(refreshToken, this.refreshSecret);
  }

  private async validateToken(token: string, secret: string) {
    try {
      const userData = jwt.verify(token, secret);
      return userData;
    } catch {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    return Token.findOne({ refreshToken });
  }
}

export const tokenService = new TokenService();
