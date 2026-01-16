/**
 * Model Registration Script
 * Explicitly registers all Mongoose models with the MongoDB connection
 * Run this script to ensure all models are properly initialized
 *
 * Usage: npm run register-models
 */

import mongoose from "mongoose";
import { config } from "dotenv";

// Load environment variables
config();

/**
 * Connect to MongoDB
 */
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log(`📍 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

/**
 * Register all models
 */
async function registerModels() {
  console.log("\n📝 Registering Mongoose models...\n");

  // Import all models to register them with mongoose
  // The order matters - import models without dependencies first

  try {
    // 1. Core user model - must be first as other models reference it
    console.log("   ⏳ Registering User model...");
    await import("@/models/users.m");
    console.log("   ✅ User model registered");

    // 2. Admin models - depend on User model
    console.log("   ⏳ Registering Admin model...");
    await import("@/models/admin.m");
    console.log("   ✅ Admin model registered");

    console.log("   ⏳ Registering AuditLog model...");
    await import("@/models/audit-logs.m");
    console.log("   ✅ AuditLog model registered");

    console.log("   ⏳ Registering Report model...");
    await import("@/models/reports.m");
    console.log("   ✅ Report model registered");

    // 3. Item models - depend on User model
    console.log("   ⏳ Registering LostItem model...");
    await import("@/models/lost-items.m");
    console.log("   ✅ LostItem model registered");

    console.log("   ⏳ Registering FoundItem model...");
    await import("@/models/found-items.m");
    console.log("   ✅ FoundItem model registered");

    console.log("   ⏳ Registering ShareItem model...");
    await import("@/models/share-items.m");
    console.log("   ✅ ShareItem model registered");

    // 4. Claims model - depends on FoundItem and User models
    console.log("   ⏳ Registering FoundItemClaim model...");
    await import("@/models/found-item-claims.m");
    console.log("   ✅ FoundItemClaim model registered");

    console.log("\n✅ All Mongoose models have been registered successfully!");

    // List all registered models
    console.log("\n📋 Registered models:");
    const model_names = mongoose.modelNames();
    model_names.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });

    console.log(`\n📊 Total models: ${model_names.length}`);

    // Verify collections exist or will be created
    console.log("\n🔍 Verifying collections...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collection_names = collections.map((c) => c.name);

    if (collection_names.length === 0) {
      console.log("   ℹ️  No collections found in database yet.");
      console.log(
        "   ℹ️  Collections will be created when first document is inserted."
      );
    } else {
      console.log("   📁 Existing collections:");
      collection_names.forEach((name, index) => {
        console.log(`      ${index + 1}. ${name}`);
      });
    }
  } catch (error) {
    console.error("\n❌ Error registering models:", error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("🚀 Starting model registration process...\n");

    await connectDB();
    await registerModels();

    console.log("\n✅ Model registration completed successfully!");
    console.log("👋 Closing connection...");

    await mongoose.connection.close();
    console.log("✅ Connection closed. Goodbye!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Fatal error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
main();
