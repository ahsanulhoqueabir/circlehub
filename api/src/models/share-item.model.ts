import mongoose, { Document, Model, Schema } from "mongoose";

export type ShareItemStatus =
  | "pending"
  | "available"
  | "reserved"
  | "shared"
  | "rejected";
export type ShareItemCondition = "new" | "like-new" | "good" | "fair";
export type ShareItemOfferType = "free" | "sale";

export interface IShareItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  condition: ShareItemCondition;
  offerType: ShareItemOfferType;
  price?: number;
  location: string;
  imageUrl?: string;
  status: ShareItemStatus;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const shareItemSchema = new Schema<IShareItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair"],
      required: true,
    },
    offerType: {
      type: String,
      enum: ["free", "sale"],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "available", "reserved", "shared", "rejected"],
      default: "available",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

shareItemSchema.index({ title: "text", description: "text", location: "text" });
shareItemSchema.index({ category: 1, status: 1, createdAt: -1 });
shareItemSchema.index({ offerType: 1, status: 1 });

const ShareItem: Model<IShareItem> =
  mongoose.models.ShareItem ||
  mongoose.model<IShareItem>("ShareItem", shareItemSchema);

export default ShareItem;
