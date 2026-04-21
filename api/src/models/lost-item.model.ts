import mongoose, { Document, Model, Schema } from "mongoose";

export type LostItemStatus = "active" | "resolved" | "archived";

export interface ILostItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  dateLost: Date;
  contactInfo: string;
  imageUrl?: string;
  status: LostItemStatus;
  tags: string[];
  rewardAmount?: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const lostItemSchema = new Schema<ILostItem>(
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
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateLost: {
      type: Date,
      required: true,
      index: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "archived"],
      default: "active",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    rewardAmount: {
      type: Number,
      min: 0,
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

lostItemSchema.index({ title: "text", description: "text", location: "text" });
lostItemSchema.index({ category: 1, status: 1, createdAt: -1 });

const LostItem: Model<ILostItem> =
  mongoose.models.LostItem ||
  mongoose.model<ILostItem>("LostItem", lostItemSchema);

export default LostItem;
