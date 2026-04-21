import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRefreshTokenSession extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  revokedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSessionSchema = new Schema<IRefreshTokenSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: undefined,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

refreshTokenSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenSession: Model<IRefreshTokenSession> =
  mongoose.models.RefreshTokenSession ||
  mongoose.model<IRefreshTokenSession>(
    "RefreshTokenSession",
    refreshTokenSessionSchema,
  );

export default RefreshTokenSession;
