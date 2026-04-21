import mongoose, { Document, Model, Schema } from "mongoose";

export type FoundItemStatus = "active" | "resolved" | "archived";

export interface IFoundItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  dateFound: Date;
  contactInfo: string;
  imageUrl?: string;
  status: FoundItemStatus;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const foundItemSchema = new Schema<IFoundItem>(
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
    dateFound: {
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

foundItemSchema.index({ title: "text", description: "text", location: "text" });
foundItemSchema.index({ category: 1, status: 1, createdAt: -1 });

const FoundItem: Model<IFoundItem> =
  mongoose.models.FoundItem ||
  mongoose.model<IFoundItem>("FoundItem", foundItemSchema);

export default FoundItem;
