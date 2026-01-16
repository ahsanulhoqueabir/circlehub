/**
 * Explicit Model Registration Script
 * Run this script to manually register all Mongoose models
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import "../lib/init-models";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campus-connect";

async function registerModels() {
  try {
    console.log("🔧 Starting explicit model registration...\n");
    console.log("=".repeat(60));

    // Connect to MongoDB
    console.log("\n📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");

    // Get all registered models
    const modelNames = mongoose.modelNames();

    console.log(`\n📦 Registered Models (${modelNames.length}):`);
    console.log("=".repeat(60));

    modelNames.forEach((modelName, index) => {
      const model = mongoose.model(modelName);
      const collectionName = model.collection.name;
      console.log(
        `${(index + 1).toString().padStart(2, "0")}. ${modelName.padEnd(
          20
        )} → ${collectionName}`
      );
    });

    console.log("=".repeat(60));

    // Verify each model by checking collection exists
    console.log("\n🔍 Verifying collections in database...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log(`\n📚 Database Collections (${collections.length}):`);
    console.log("=".repeat(60));

    collections.forEach((col, index) => {
      console.log(`${(index + 1).toString().padStart(2, "0")}. ${col.name}`);
    });

    console.log("=".repeat(60));

    // Check for models without collections
    console.log("\n⚠️  Models without collections in database:");
    let hasUninitialized = false;

    modelNames.forEach((modelName) => {
      const model = mongoose.model(modelName);
      const collectionName = model.collection.name;

      if (!collectionNames.includes(collectionName)) {
        console.log(`   - ${modelName} (${collectionName})`);
        hasUninitialized = true;
      }
    });

    if (!hasUninitialized) {
      console.log("   ✅ All models have corresponding collections");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Model registration check completed!");
    console.log("=".repeat(60) + "\n");

    console.log("💡 Tips:");
    console.log("   - If collections are missing, run: npm run db:seed");
    console.log("   - To clear and reseed: npm run db:seed:fresh");
    console.log(
      "   - Models are automatically registered via instrumentation.ts\n"
    );
  } catch (error) {
    console.error("\n❌ Model registration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed\n");
  }
}

// Run registration check
registerModels();
