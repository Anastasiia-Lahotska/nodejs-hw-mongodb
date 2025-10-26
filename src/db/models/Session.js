import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, },
    accessToken: { type: String, required: true, index: true, unique: true, },
    refreshToken: { type: String, required: true, index: true,
      unique: true, },
    accessTokenValidUntil: { type: Date, required: true, },
    refreshTokenValidUntil: { type: Date, required: true, },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Session = model('Session', sessionSchema);