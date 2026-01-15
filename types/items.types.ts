import { Database } from "@/lib/database.types";

// Database types
export type LostItem = Database["public"]["Tables"]["lost_items"]["Row"];
export type LostItemInsert =
  Database["public"]["Tables"]["lost_items"]["Insert"];
export type LostItemUpdate =
  Database["public"]["Tables"]["lost_items"]["Update"];

export type FoundItem = Database["public"]["Tables"]["found_items"]["Row"];
export type FoundItemInsert =
  Database["public"]["Tables"]["found_items"]["Insert"];
export type FoundItemUpdate =
  Database["public"]["Tables"]["found_items"]["Update"];

export type ShareItem = Database["public"]["Tables"]["share_items"]["Row"];
export type ShareItemInsert =
  Database["public"]["Tables"]["share_items"]["Insert"];
export type ShareItemUpdate =
  Database["public"]["Tables"]["share_items"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Claim types
export interface FoundItemClaim {
  id: string;
  found_item_id: string;
  claimer_id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  contact_info: {
    phone?: string;
    email?: string;
    preferredContact?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface FoundItemClaimWithProfile extends FoundItemClaim {
  claimer_profile: UserProfile;
  found_item?: FoundItem;
}

export interface CreateClaimRequest {
  found_item_id: string;
  message?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    preferredContact?: string;
  };
}

export interface UpdateClaimRequest {
  status?: "pending" | "approved" | "rejected";
  message?: string;
}

// User profile info for contact
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

// Item status
export type ItemStatus = "active" | "resolved" | "archived";

// Item categories
export const ITEM_CATEGORIES = [
  "electronics",
  "clothing",
  "accessories",
  "documents",
  "books",
  "keys",
  "bags",
  "sports",
  "jewelry",
  "others",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

// Sort options
export const SORT_OPTIONS = [
  "newest",
  "oldest",
  "most-viewed",
  "recently-updated",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

// Filter options for GET requests
export interface ItemFilterOptions {
  category?: ItemCategory | "all";
  status?: ItemStatus;
  search?: string;
  tags?: string[];
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

// User profile info for contact
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

// Lost item with profile
export interface LostItemWithProfile extends LostItem {
  profile: UserProfile;
}

// Found item with profile
export interface FoundItemWithProfile extends FoundItem {
  profile: UserProfile;
}

// Share item with profile
export interface ShareItemWithProfile extends ShareItem {
  profile: UserProfile;
}

// API Response types
export interface ItemsResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SingleItemResponse<T> {
  item: T;
}

// Create/Update request types
export interface CreateLostItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  dateLost: string;
  imageUrl?: string | null;
  imageBase64?: string; // Base64 encoded image data
  tags?: string[];
  rewardAmount?: number;
}

export interface UpdateLostItemRequest {
  title?: string;
  description?: string;
  category?: ItemCategory;
  location?: string;
  dateLost?: string;
  imageUrl?: string | null;
  tags?: string[];
  status?: ItemStatus;
  rewardAmount?: number;
}

export interface CreateFoundItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  dateFound: string;
  imageUrl?: string | null;
  imageBase64?: string; // Base64 encoded image data
  tags?: string[];
}

export interface UpdateFoundItemRequest {
  title?: string;
  description?: string;
  category?: ItemCategory;
  location?: string;
  dateFound?: string;
  imageUrl?: string | null;
  tags?: string[];
  status?: ItemStatus;
}

export interface CreateShareItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  offerType: "free" | "exchange" | "rent" | "sale";
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  price?: number | null;
  imageUrl?: string | null;
  imageBase64?: string; // Base64 encoded image data
  tags?: string[];
}

export interface UpdateShareItemRequest {
  title?: string;
  description?: string;
  category?: ItemCategory;
  location?: string;
  offerType?: "free" | "exchange" | "rent";
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
  price?: number | null;
  imageUrl?: string | null;
  tags?: string[];
  status?: ItemStatus;
}

// Statistics types
export interface ItemStatistics {
  totalItems: number;
  activeItems: number;
  resolvedItems: number;
  itemsByCategory: Record<ItemCategory, number>;
  recentItems: number;
}

// Error response
export interface ErrorResponse {
  error: string;
  details?: unknown;
}
