import mongoose, { Schema, Document } from "mongoose";

/**
 * Admin Interface
 * Represents an admin user with specific roles and permissions
 */
export interface IAdmin extends Document {
  user_id: mongoose.Types.ObjectId; // Reference to User model
  role: "super_admin" | "moderator" | "support_staff";
  permissions: string[];
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
    role: {
      type: String,
      enum: {
        values: ["super_admin", "moderator", "support_staff"],
        message: "{VALUE} is not a valid admin role",
      },
      required: [true, "Admin role is required"],
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
admin_schema.index({ role: 1, is_active: 1 });

// Virtual for user details
admin_schema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

// Pre-save hook to set default permissions based on role
admin_schema.pre("save", function () {
  if (this.isNew || this.isModified("role")) {
    switch (this.role) {
      case "super_admin":
        this.permissions = [
          "users.view",
          "users.edit",
          "users.delete",
          "users.ban",
          "items.view",
          "items.edit",
          "items.delete",
          "items.approve",
          "claims.view",
          "claims.manage",
          "reports.view",
          "reports.manage",
          "analytics.view",
          "logs.view",
          "logs.export",
          "admins.manage",
          "settings.edit",
        ];
        break;
      case "moderator":
        this.permissions = [
          "users.view",
          "users.ban",
          "items.view",
          "items.edit",
          "items.approve",
          "items.delete",
          "claims.view",
          "claims.manage",
          "reports.view",
          "reports.manage",
          "analytics.view",
        ];
        break;
      case "support_staff":
        this.permissions = [
          "users.view",
          "items.view",
          "claims.view",
          "reports.view",
        ];
        break;
    }
  }
});

// Export model
export const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", admin_schema);
