import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Import all models
import "../lib/init-models";

// Import models
import User from "../models/users.m";
import { Admin } from "../models/admin.m";
import FoundItem from "../models/found-items.m";
import LostItem from "../models/lost-items.m";
import ShareItem from "../models/share-items.m";
import FoundItemClaim from "../models/found-item-claims.m";
import { Report } from "../models/reports.m";
import { AuditLog } from "../models/audit-logs.m";

// Import mock data
import { users_data } from "../lib/mock-data/users.data";
import { admins_data } from "../lib/mock-data/admins.data";
import { found_items_data } from "../lib/mock-data/found-items.data";
import { lost_items_data } from "../lib/mock-data/lost-items.data";
import { share_items_data } from "../lib/mock-data/share-items.data";
import { found_item_claims_data } from "../lib/mock-data/found-item-claims.data";
import { reports_data } from "../lib/mock-data/reports.data";
import { audit_logs_data } from "../lib/mock-data/audit-logs.data";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campus-connect";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearCollections() {
  console.log("\n🗑️  Clearing existing collections...");

  // Use mongoose.connection.db directly to avoid model issues
  const db = mongoose.connection.db;

  const collections = [
    "users",
    "admins",
    "found_items",
    "lost_items",
    "share_items",
    "found_item_claims",
    "reports",
    "audit_logs",
  ];

  for (const collectionName of collections) {
    try {
      await db.collection(collectionName).deleteMany({});
    } catch (error) {
      // Collection might not exist, that's okay
      console.log(`⚠️  Collection ${collectionName} not found, skipping...`);
    }
  }

  console.log("✅ All collections cleared");
}

async function seedUsers() {
  console.log("\n👥 Seeding users...");

  const users = await Promise.all(
    users_data.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return await User.create({
        ...user,
        password: hashedPassword,
      });
    })
  );

  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function seedAdmins(users: any[]) {
  console.log("\n🔐 Seeding admins...");

  // Use first 3 users as admins
  const adminUsers = users.slice(0, 3);

  const admins = await Promise.all(
    admins_data.map(async (admin, index) => {
      return await Admin.create({
        ...admin,
        user_id: adminUsers[index]._id,
      });
    })
  );

  console.log(`✅ Created ${admins.length} admins`);
  return admins;
}

async function seedFoundItems(users: any[]) {
  console.log("\n🔍 Seeding found items...");

  const foundItems = await Promise.all(
    found_items_data.map(async (item, index) => {
      const userIndex = index % users.length;
      return await FoundItem.create({
        ...item,
        user_id: users[userIndex]._id,
      });
    })
  );

  console.log(`✅ Created ${foundItems.length} found items`);
  return foundItems;
}

async function seedLostItems(users: any[]) {
  console.log("\n🔎 Seeding lost items...");

  const lostItems = await Promise.all(
    lost_items_data.map(async (item, index) => {
      const userIndex = index % users.length;
      return await LostItem.create({
        ...item,
        user_id: users[userIndex]._id,
      });
    })
  );

  console.log(`✅ Created ${lostItems.length} lost items`);
  return lostItems;
}

async function seedShareItems(users: any[]) {
  console.log("\n📦 Seeding share items...");

  const shareItems = await Promise.all(
    share_items_data.map(async (item, index) => {
      const userIndex = index % users.length;
      return await ShareItem.create({
        ...item,
        user_id: users[userIndex]._id,
      });
    })
  );

  console.log(`✅ Created ${shareItems.length} share items`);
  return shareItems;
}

async function seedFoundItemClaims(foundItems: any[], users: any[]) {
  console.log("\n✋ Seeding found item claims...");

  const claims = [];

  // Create one claim per found item to avoid conflicts
  for (
    let i = 0;
    i < Math.min(found_item_claims_data.length, foundItems.length);
    i++
  ) {
    const claim = found_item_claims_data[i];
    const userIndex = (i + 1) % users.length; // Different user than item owner

    try {
      const createdClaim = await FoundItemClaim.create({
        ...claim,
        foundItemId: foundItems[i]._id,
        claimerId: users[userIndex]._id,
      });
      claims.push(createdClaim);
    } catch (error) {
      console.log(`⚠️  Skipping claim ${i + 1}: ${error.message}`);
    }
  }

  console.log(`✅ Created ${claims.length} claims`);
  return claims;
}

async function seedReports(users: any[], items: any[]) {
  console.log("\n🚩 Seeding reports...");

  const reports = await Promise.all(
    reports_data.map(async (report, index) => {
      const reporterIndex = index % users.length;
      const itemIndex = index % items.length;

      return await Report.create({
        ...report,
        reporter_id: users[reporterIndex]._id,
        reported_id: items[itemIndex]._id,
      });
    })
  );

  console.log(`✅ Created ${reports.length} reports`);
  return reports;
}

async function seedAuditLogs(admins: any[], users: any[]) {
  console.log("\n📋 Seeding audit logs...");

  const logs = await Promise.all(
    audit_logs_data.map(async (log, index) => {
      const adminIndex = index % admins.length;
      const userIndex = index % users.length;

      return await AuditLog.create({
        ...log,
        admin_id: admins[adminIndex]._id,
        target_id: users[userIndex]._id,
      });
    })
  );

  console.log(`✅ Created ${logs.length} audit logs`);
  return logs;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");
    console.log("=".repeat(50));

    await connectDB();
    await clearCollections();

    // Seed in order due to dependencies
    const users = await seedUsers();
    const admins = await seedAdmins(users);
    const foundItems = await seedFoundItems(users);
    const lostItems = await seedLostItems(users);
    const shareItems = await seedShareItems(users);

    // Combine all items for reports
    const allItems = [...foundItems, ...lostItems, ...shareItems];

    await seedFoundItemClaims(foundItems, users);
    await seedReports(users, allItems);
    await seedAuditLogs(admins, users);

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Admins: ${admins.length}`);
    console.log(`   - Found Items: ${foundItems.length}`);
    console.log(`   - Lost Items: ${lostItems.length}`);
    console.log(`   - Share Items: ${shareItems.length}`);
    console.log(`   - Total Items: ${allItems.length}`);
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run seeding
seedDatabase();
