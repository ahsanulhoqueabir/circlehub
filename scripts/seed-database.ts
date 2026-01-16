/**
 * Database Seeding Script
 * Seeds the database with mock data for development and testing
 *
 * Usage: npm run seed
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load environment variables
config();

// Import all models to register them
import "@/lib/init-models";

// Import models
import User from "@/models/users.m";
import Admin from "@/models/admin.m";
import LostItem from "@/models/lost-items.m";
import FoundItem from "@/models/found-items.m";
import ShareItem from "@/models/share-items.m";
import FoundItemClaim from "@/models/found-item-claims.m";
import AuditLog from "@/models/audit-logs.m";
import Report from "@/models/reports.m";

// Mock data imports
import { users_data } from "@/lib/mock-data/users.data";
import { admins_data } from "@/lib/mock-data/admins.data";
import { lost_items_data } from "@/lib/mock-data/lost-items.data";
import { found_items_data } from "@/lib/mock-data/found-items.data";
import { share_items_data } from "@/lib/mock-data/share-items.data";
import { claims_data } from "@/lib/mock-data/claims.data";
import { audit_logs_data } from "@/lib/mock-data/audit-logs.data";
import { reports_data } from "@/lib/mock-data/reports.data";

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
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

/**
 * Clear all collections
 */
async function clearDatabase() {
  console.log("\n🧹 Clearing database...");

  await User.deleteMany({});
  await Admin.deleteMany({});
  await LostItem.deleteMany({});
  await FoundItem.deleteMany({});
  await ShareItem.deleteMany({});
  await FoundItemClaim.deleteMany({});
  await AuditLog.deleteMany({});
  await Report.deleteMany({});

  console.log("✅ Database cleared");
}

/**
 * Hash passwords for users
 */
async function hashPasswords(users: any[]) {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return users;
}

/**
 * Seed all collections
 */
async function seedDatabase() {
  try {
    console.log("\n🌱 Starting database seeding...\n");

    // 1. Seed Users
    console.log("📝 Seeding users...");
    const hashed_users = await hashPasswords([...users_data]);
    const created_users = await User.insertMany(hashed_users);
    console.log(`✅ Created ${created_users.length} users`);

    // 2. Seed Admins (using created user IDs)
    console.log("\n📝 Seeding admins...");
    const admin_users = created_users.filter((u) => u.role === "admin");
    const admins_with_ids = admins_data.map((admin, index) => ({
      ...admin,
      user_id: admin_users[index]?._id || created_users[0]._id,
    }));
    const created_admins = await Admin.insertMany(admins_with_ids);
    console.log(`✅ Created ${created_admins.length} admins`);

    // 3. Seed Lost Items
    console.log("\n📝 Seeding lost items...");
    const lost_items_with_ids = lost_items_data.map((item, index) => ({
      ...item,
      user_id: created_users[index % created_users.length]._id,
    }));
    const created_lost_items = await LostItem.insertMany(lost_items_with_ids);
    console.log(`✅ Created ${created_lost_items.length} lost items`);

    // 4. Seed Found Items
    console.log("\n📝 Seeding found items...");
    const found_items_with_ids = found_items_data.map((item, index) => ({
      ...item,
      user_id: created_users[(index + 1) % created_users.length]._id,
    }));
    const created_found_items = await FoundItem.insertMany(
      found_items_with_ids
    );
    console.log(`✅ Created ${created_found_items.length} found items`);

    // 5. Seed Share Items
    console.log("\n📝 Seeding share items...");
    const share_items_with_ids = share_items_data.map((item, index) => ({
      ...item,
      user_id: created_users[(index + 2) % created_users.length]._id,
    }));
    const created_share_items = await ShareItem.insertMany(
      share_items_with_ids
    );
    console.log(`✅ Created ${created_share_items.length} share items`);

    // 6. Seed Found Item Claims
    console.log("\n📝 Seeding claims...");
    const claims_with_ids = claims_data.map((claim, index) => ({
      ...claim,
      foundItemId: created_found_items[index % created_found_items.length]._id,
      claimerId: created_users[(index + 3) % created_users.length]._id,
    }));
    const created_claims = await FoundItemClaim.insertMany(claims_with_ids);
    console.log(`✅ Created ${created_claims.length} claims`);

    // 7. Seed Audit Logs
    console.log("\n📝 Seeding audit logs...");
    const logs_with_ids = audit_logs_data.map((log, index) => ({
      ...log,
      admin_id: created_admins[index % created_admins.length]._id,
      target_id:
        log.target_type === "user"
          ? created_users[index % created_users.length]._id
          : log.target_type === "item"
          ? created_lost_items[index % created_lost_items.length]._id
          : created_claims[index % created_claims.length]._id,
    }));
    const created_logs = await AuditLog.insertMany(logs_with_ids);
    console.log(`✅ Created ${created_logs.length} audit logs`);

    // 8. Seed Reports
    console.log("\n📝 Seeding reports...");
    const reports_with_ids = reports_data.map((report, index) => ({
      ...report,
      reporter_id: created_users[index % created_users.length]._id,
      reported_id:
        report.reported_type === "item"
          ? created_lost_items[index % created_lost_items.length]._id
          : created_users[(index + 1) % created_users.length]._id,
      assigned_to: report.assigned_to ? created_admins[0]._id : undefined,
    }));
    const created_reports = await Report.insertMany(reports_with_ids);
    console.log(`✅ Created ${created_reports.length} reports`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${created_users.length}`);
    console.log(`   Admins: ${created_admins.length}`);
    console.log(`   Lost Items: ${created_lost_items.length}`);
    console.log(`   Found Items: ${created_found_items.length}`);
    console.log(`   Share Items: ${created_share_items.length}`);
    console.log(`   Claims: ${created_claims.length}`);
    console.log(`   Audit Logs: ${created_logs.length}`);
    console.log(`   Reports: ${created_reports.length}`);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await connectDB();
    await clearDatabase();
    await seedDatabase();

    console.log("\n✅ All done! Closing connection...");
    await mongoose.connection.close();
    console.log("👋 Connection closed. Goodbye!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Fatal error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
main();
