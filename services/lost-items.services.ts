import { createServerClient, createServiceRoleClient } from "@/lib/supabase";
import {
  ItemFilterOptions,
  ItemsResponse,
  LostItem,
  LostItemInsert,
  LostItemUpdate,
  LostItemWithProfile,
  ItemStatistics,
  ITEM_CATEGORIES,
} from "@/types/items.types";

/**
 * Service for managing lost items with optimized queries
 */
export class LostItemsService {
  /**
   * Get lost items with filtering, sorting, and pagination
   */
  static async getItems(
    filters: ItemFilterOptions = {}
  ): Promise<ItemsResponse<LostItemWithProfile>> {
    const supabase = createServerClient();

    const {
      category,
      status = "active",
      search,
      tags,
      location,
      dateFrom,
      dateTo,
      userId,
      sort = "newest",
      limit = 20,
      offset = 0,
    } = filters;

    // Build base query
    let query = supabase.from("lost_items").select("*", { count: "exact" });

    // Apply filters
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

    if (dateFrom) {
      query = query.gte("date_lost", dateFrom);
    }

    if (dateTo) {
      query = query.lte("date_lost", dateTo);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Apply sorting
    switch (sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "most-viewed":
        query = query.order("views", { ascending: false });
        break;
      case "recently-updated":
        query = query.order("updated_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch lost items: ${error.message}`);
    }

    // Manually fetch profiles for all user_ids
    const userIds = [...new Set(data?.map((item) => item.user_id) || [])];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, name, email, phone, avatar_url")
      .in("id", userIds);

    // Create a map of profiles
    const profilesMap = new Map(
      profilesData?.map((profile) => [profile.id, profile]) || []
    );

    // Attach profiles to items
    const itemsWithProfiles =
      data?.map((item) => ({
        ...item,
        profile: profilesMap.get(item.user_id)!,
      })) || [];

    const total = count || 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const hasMore = offset + limit < total;

    return {
      items: itemsWithProfiles as LostItemWithProfile[],
      total,
      page: currentPage,
      limit,
      hasMore,
    };
  }

  /**
   * Get a single lost item by ID
   */
  static async getItemById(
    itemId: string
  ): Promise<LostItemWithProfile | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("lost_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch lost item: ${error.message}`);
    }

    // Fetch profile separately
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, name, email, phone, avatar_url")
      .eq("id", data.user_id)
      .single();

    // Increment view count
    await this.incrementViews(itemId);

    return {
      ...data,
      profile: profileData!,
    } as LostItemWithProfile;
  }

  /**
   * Create a new lost item
   */
  static async createItem(
    userId: string,
    itemData: Omit<
      LostItemInsert,
      "id" | "user_id" | "created_at" | "updated_at"
    >
  ): Promise<LostItem> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("lost_items")
      .insert([
        {
          ...itemData,
          user_id: userId,
          status: "active",
          views: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lost item: ${error.message}`);
    }

    return data as LostItem;
  }

  /**
   * Update a lost item
   */
  static async updateItem(
    itemId: string,
    userId: string,
    updates: LostItemUpdate
  ): Promise<LostItem> {
    const supabase = createServiceRoleClient();

    // First verify ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("lost_items")
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
      .from("lost_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lost item: ${error.message}`);
    }

    return data as LostItem;
  }

  /**
   * Delete a lost item
   */
  static async deleteItem(itemId: string, userId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    // First verify ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("lost_items")
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
      .from("lost_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw new Error(`Failed to delete lost item: ${error.message}`);
    }
  }

  /**
   * Mark item as resolved
   */
  static async markAsResolved(
    itemId: string,
    userId: string
  ): Promise<LostItem> {
    return this.updateItem(itemId, userId, { status: "resolved" });
  }

  /**
   * Increment view count
   */
  static async incrementViews(itemId: string): Promise<void> {
    const supabase = createServerClient();

    await supabase.rpc("increment_lost_item_views", {
      item_id: itemId,
    });
  }

  /**
   * Get items statistics
   */
  static async getStatistics(userId?: string): Promise<ItemStatistics> {
    const supabase = createServerClient();

    let query = supabase
      .from("lost_items")
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

    // Get recent items (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let recentQuery = supabase
      .from("lost_items")
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
  ): Promise<ItemsResponse<LostItemWithProfile>> {
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
  ): Promise<ItemsResponse<LostItemWithProfile>> {
    return this.getItems({
      ...filters,
      userId,
    });
  }
}
