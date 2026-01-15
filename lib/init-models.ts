/**
 * Model Initialization Script
 * This file imports all mongoose models to ensure they are registered
 * before any database operations are performed.
 *
 * Usage: Import this file at the top of your API routes or services
 * import '@/lib/init-models';
 */

// Import all models to register them with mongoose
// The order matters - import models without dependencies first

// Core user model - must be first as other models reference it
import "@/models/users.m";

// Item models - depend on User model
import "@/models/lost-items.m";
import "@/models/found-items.m";
import "@/models/share-items.m";

// Claims model - depends on FoundItem and User models
import "@/models/found-item-claims.m";

console.log("✅ All mongoose models have been registered");
