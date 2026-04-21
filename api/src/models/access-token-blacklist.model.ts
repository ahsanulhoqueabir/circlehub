import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAccessTokenBlacklist extends Document {
  jti: string;
  userId: mongoose.Types.ObjectId;
  reason: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const accessTokenBlacklistSchema = new Schema<IAccessTokenBlacklist>(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      default: "logout",
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

accessTokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AccessTokenBlacklist: Model<IAccessTokenBlacklist> =
  mongoose.models.AccessTokenBlacklist ||
  mongoose.model<IAccessTokenBlacklist>(
    "AccessTokenBlacklist",
    accessTokenBlacklistSchema,
  );

export default AccessTokenBlacklist;
