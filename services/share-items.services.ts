import { createServerClient, createServiceRoleClient } from "@/lib/supabase";
import {
  ItemFilterOptions,
  ItemsResponse,
  ShareItem,
  ShareItemInsert,
  ShareItemUpdate,
  ShareItemWithProfile,
  ItemStatistics,
  ITEM_CATEGORIES,
} from "@/types/items.types";

/**
 * Service for managing share items with optimized queries
 */
export class ShareItemsService {
  /**
   * Get share items with filtering, sorting, and pagination
   */
  static async getItems(
    filters: ItemFilterOptions & { offerType?: string; condition?: string } = {}
  ): Promise<ItemsResponse<ShareItemWithProfile>> {
    const supabase = createServerClient();

    const {
      category,
      status = "active",
      search,
      tags,
      location,
      userId,
      sort = "newest",
      limit = 20,
      offset = 0,
      offerType,
      condition,
    } = filters;

    let query = supabase.from("share_items").select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    if (tags && tags.length > 0) {
      query = query.overlaps("tags", tags);
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (offerType) {
      query = query.eq("offer_type", offerType);
    }

    if (condition) {
      query = query.eq("condition", condition);
    }

    switch (sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "recently-updated":
        query = query.order("updated_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch share items: ${error.message}`);
    }

    // Manually fetch profiles for each item
    const items = data as ShareItem[];
    const userIds = [...new Set(items.map((item) => item.user_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, email, avatar_url")
      .in("id", userIds);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // Map profiles to items
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    const itemsWithProfiles: ShareItemWithProfile[] = items.map((item) => ({
      ...item,
      profiles: profileMap.get(item.user_id) || undefined,
    }));

    const total = count || 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const hasMore = offset + limit < total;

    return {
      items: itemsWithProfiles,
      total,
      page: currentPage,
      limit,
      hasMore,
    };
  }

  /**
   * Get a single share item by ID
   */
  static async getItemById(
    itemId: string
  ): Promise<ShareItemWithProfile | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("share_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch share item: ${error.message}`);
    }

    const item = data as ShareItem;

    // Manually fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, avatar_url")
      .eq("id", item.user_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    return {
      ...item,
      profiles: profile || undefined,
    };
  }

  /**
   * Create a new share item
   */
  static async createItem(
    userId: string,
    itemData: Omit<
      ShareItemInsert,
      "id" | "user_id" | "created_at" | "updated_at"
    >
  ): Promise<ShareItem> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("share_items")
      .insert([
        {
          ...itemData,
          user_id: userId,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create share item: ${error.message}`);
    }

    return data as ShareItem;
  }

  /**
   * Update a share item
   */
  static async updateItem(
    itemId: string,
    userId: string,
    updates: ShareItemUpdate
  ): Promise<ShareItem> {
    const supabase = createServiceRoleClient();

    const { data: existingItem, error: fetchError } = await supabase
      .from("share_items")
      .select("user_id")
      .eq("id", itemId)
      .single();

    if (fetchError || !existingItem) {
      throw new Error("Item not found");
    }

    if (existingItem.user_id !== userId) {
      throw new Error("Unauthorized: You can only update your own items");
    }

    const { data, error } = await supabase
      .from("share_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update share item: ${error.message}`);
    }

    return data as ShareItem;
  }

  /**
   * Delete a share item
   */
  static async deleteItem(itemId: string, userId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { data: existingItem, error: fetchError } = await supabase
      .from("share_items")
      .select("user_id")
      .eq("id", itemId)
      .single();

    if (fetchError || !existingItem) {
      throw new Error("Item not found");
    }

    if (existingItem.user_id !== userId) {
      throw new Error("Unauthorized: You can only delete your own items");
    }

    const { error } = await supabase
      .from("share_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw new Error(`Failed to delete share item: ${error.message}`);
    }
  }

  /**
   * Get items statistics
   */
  static async getStatistics(userId?: string): Promise<ItemStatistics> {
    const supabase = createServerClient();

    let query = supabase
      .from("share_items")
      .select("category, status", { count: "exact" });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }

    const itemsByCategory = ITEM_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {} as Record<string, number>);

    let activeCount = 0;
    let resolvedCount = 0;

    data?.forEach((item) => {
      if (item.category) {
        itemsByCategory[item.category]++;
      }
      if (item.status === "active") {
        activeCount++;
      } else if (item.status === "resolved") {
        resolvedCount++;
      }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let recentQuery = supabase
      .from("share_items")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    if (userId) {
      recentQuery = recentQuery.eq("user_id", userId);
    }

    const { count: recentCount } = await recentQuery;

    return {
      totalItems: count || 0,
      activeItems: activeCount,
      resolvedItems: resolvedCount,
      itemsByCategory: itemsByCategory as Record<any, number>,
      recentItems: recentCount || 0,
    };
  }

  /**
   * Search items by text
   */
  static async searchItems(
    searchQuery: string,
    filters?: Omit<ItemFilterOptions, "search">
  ): Promise<ItemsResponse<ShareItemWithProfile>> {
    return this.getItems({
      ...filters,
      search: searchQuery,
    });
  }

  /**
   * Get user's items
   */
  static async getUserItems(
    userId: string,
    filters?: Omit<ItemFilterOptions, "userId">
  ): Promise<ItemsResponse<ShareItemWithProfile>> {
    return this.getItems({
      ...filters,
      userId,
    });
  }
}
