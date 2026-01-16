import mongoose, { Schema, Document } from "mongoose";

/**
 * Admin Interface
 * Stores additional admin-specific data and permissions
 * Note: The actual role is stored in the users collection
 * This collection only stores extra admin metadata
 */
export interface IAdmin extends Document {
  user_id: mongoose.Types.ObjectId; // Reference to User model
  permissions: string[]; // Custom permissions for this admin
  last_login: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Admin Schema
 * Manages admin-specific data and permissions
 */
const admin_schema = new Schema<IAdmin>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    last_login: {
      type: Date,
      default: Date.now,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "admins",
  }
);

// Indexes for better query performance
admin_schema.index({ is_active: 1 });

// Virtual for user details
admin_schema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

// Export model
export const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", admin_schema);
