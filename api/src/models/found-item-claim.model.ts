import mongoose, { Document, Model, Schema } from "mongoose";

export type FoundItemClaimStatus = "pending" | "approved" | "rejected";

export interface IFoundItemClaim extends Document {
  foundItemId: mongoose.Types.ObjectId;
  claimerId: mongoose.Types.ObjectId;
  status: FoundItemClaimStatus;
  message?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    other?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const foundItemClaimSchema = new Schema<IFoundItemClaim>(
  {
    foundItemId: {
      type: Schema.Types.ObjectId,
      ref: "FoundItem",
      required: true,
      index: true,
    },
    claimerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    message: {
      type: String,
      trim: true,
    },
    contactInfo: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      other: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

foundItemClaimSchema.index({ foundItemId: 1, claimerId: 1 }, { unique: true });
foundItemClaimSchema.index({ foundItemId: 1, status: 1 });
foundItemClaimSchema.index({ claimerId: 1, createdAt: -1 });

const FoundItemClaim: Model<IFoundItemClaim> =
  mongoose.models.FoundItemClaim ||
  mongoose.model<IFoundItemClaim>("FoundItemClaim", foundItemClaimSchema);

export default FoundItemClaim;
