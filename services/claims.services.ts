import { createServiceRoleClient } from "@/lib/supabase";
import {
  FoundItemClaim,
  FoundItemClaimWithProfile,
  CreateClaimRequest,
  UpdateClaimRequest,
} from "@/types/items.types";

export class ClaimsService {
  /**
   * Create a new claim for a found item
   */
  static async createClaim(
    userId: string,
    claimData: CreateClaimRequest
  ): Promise<FoundItemClaim> {
    const supabase = createServiceRoleClient();

    // Check if user already claimed this item
    const { data: existingClaim } = await supabase
      .from("found_item_claims")
      .select("id")
      .eq("found_item_id", claimData.found_item_id)
      .eq("claimer_id", userId)
      .single();

    if (existingClaim) {
      throw new Error("You have already claimed this item");
    }

    // Check if item is still available
    const { data: foundItem } = await supabase
      .from("found_items")
      .select("status, user_id")
      .eq("id", claimData.found_item_id)
      .single();

    if (!foundItem) {
      throw new Error("Found item not found");
    }

    if (foundItem.status !== "available") {
      throw new Error("This item is no longer available for claiming");
    }

    // User cannot claim their own found item
    if (foundItem.user_id === userId) {
      throw new Error("You cannot claim your own found item");
    }

    const { data, error } = await supabase
      .from("found_item_claims")
      .insert({
        found_item_id: claimData.found_item_id,
        claimer_id: userId,
        message: claimData.message || null,
        contact_info: claimData.contact_info || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating claim:", error);
      throw new Error(error.message || "Failed to create claim in database");
    }
    if (!data) {
      throw new Error("No data returned from claim creation");
    }
    return data as FoundItemClaim;
  }

  /**
   * Get all claims for a specific found item (for item owner)
   */
  static async getClaimsByItemId(
    itemId: string,
    userId: string
  ): Promise<FoundItemClaimWithProfile[]> {
    const supabase = createServiceRoleClient();

    // Verify user owns this item
    const { data: foundItem } = await supabase
      .from("found_items")
      .select("user_id")
      .eq("id", itemId)
      .single();

    if (!foundItem || foundItem.user_id !== userId) {
      throw new Error("Unauthorized to view claims for this item");
    }

    const { data, error } = await supabase
      .from("found_item_claims")
      .select(
        `
        *,
        claimer_profile:profiles!claimer_id (
          id,
          name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .eq("found_item_id", itemId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as FoundItemClaimWithProfile[];
  }

  /**
   * Get all claims made by a user
   */
  static async getClaimsByUserId(
    userId: string
  ): Promise<FoundItemClaimWithProfile[]> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("found_item_claims")
      .select(
        `
        *,
        found_item:found_items (
          id,
          title,
          description,
          category,
          location,
          date_found,
          image_url,
          status,
          user_id,
          created_at
        ),
        claimer_profile:profiles!claimer_id (
          id,
          name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .eq("claimer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as FoundItemClaimWithProfile[];
  }

  /**
   * Get all claims received by a user (for items they found)
   */
  static async getReceivedClaims(
    userId: string
  ): Promise<FoundItemClaimWithProfile[]> {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("found_item_claims")
      .select(
        `
        *,
        found_item:found_items!inner (
          id,
          title,
          description,
          category,
          location,
          date_found,
          image_url,
          status,
          user_id,
          created_at
        ),
        claimer_profile:profiles!claimer_id (
          id,
          name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .eq("found_items.user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as FoundItemClaimWithProfile[];
  }

  /**
   * Update claim status (approve/reject)
   */
  static async updateClaimStatus(
    claimId: string,
    userId: string,
    updateData: UpdateClaimRequest
  ): Promise<FoundItemClaim> {
    const supabase = createServiceRoleClient();

    // Get claim and verify ownership
    const { data: claim } = await supabase
      .from("found_item_claims")
      .select("found_item_id")
      .eq("id", claimId)
      .single();

    if (!claim) {
      throw new Error("Claim not found");
    }

    // Verify user owns the found item
    const { data: foundItem } = await supabase
      .from("found_items")
      .select("user_id")
      .eq("id", claim.found_item_id)
      .single();

    if (!foundItem || foundItem.user_id !== userId) {
      throw new Error("Unauthorized to update this claim");
    }

    const { data, error } = await supabase
      .from("found_item_claims")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId)
      .select()
      .single();

    if (error) throw error;
    return data as FoundItemClaim;
  }

  /**
   * Delete a claim (user can only delete their own pending claims)
   */
  static async deleteClaim(claimId: string, userId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    const { data: claim } = await supabase
      .from("found_item_claims")
      .select("claimer_id, status")
      .eq("id", claimId)
      .single();

    if (!claim) {
      throw new Error("Claim not found");
    }

    if (claim.claimer_id !== userId) {
      throw new Error("Unauthorized to delete this claim");
    }

    if (claim.status !== "pending") {
      throw new Error("Can only delete pending claims");
    }

    const { error } = await supabase
      .from("found_item_claims")
      .delete()
      .eq("id", claimId);

    if (error) throw error;
  }

  /**
   * Check if user has claimed an item
   */
  static async hasUserClaimed(
    userId: string,
    itemId: string
  ): Promise<boolean> {
    const supabase = createServiceRoleClient();

    const { data } = await supabase
      .from("found_item_claims")
      .select("id")
      .eq("found_item_id", itemId)
      .eq("claimer_id", userId)
      .single();

    return !!data;
  }

  /**
   * Get claim count for an item
   */
  static async getClaimCount(itemId: string): Promise<number> {
    const supabase = createServiceRoleClient();

    const { count, error } = await supabase
      .from("found_item_claims")
      .select("*", { count: "exact", head: true })
      .eq("found_item_id", itemId);

    if (error) throw error;
    return count || 0;
  }
}
