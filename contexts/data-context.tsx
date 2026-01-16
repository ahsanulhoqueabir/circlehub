"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type {
  LostItemWithProfile,
  FoundItemWithProfile,
  ShareItemWithProfile,
} from "@/types/items.types";

// Data State Types
interface ItemsState<T> {
  items: T[];
  is_loading: boolean;
  error: string | null;
  last_fetched: Date | null;
}

// Data Context Type
interface DataContextType {
  // Lost Items State
  lost_items: ItemsState<LostItemWithProfile>;
  refetch_lost_items: () => Promise<void>;

  // Found Items State
  found_items: ItemsState<FoundItemWithProfile>;
  refetch_found_items: () => Promise<void>;

  // Share Items State
  share_items: ItemsState<ShareItemWithProfile>;
  refetch_share_items: () => Promise<void>;

  // Refetch all data
  refetch_all: () => Promise<void>;

  // Global loading state
  is_initial_loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial state helper
const create_initial_state = <T,>(): ItemsState<T> => ({
  items: [],
  is_loading: true,
  error: null,
  last_fetched: null,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Independent states for each item type
  const [lost_items, set_lost_items] = useState<
    ItemsState<LostItemWithProfile>
  >(create_initial_state());
  const [found_items, set_found_items] = useState<
    ItemsState<FoundItemWithProfile>
  >(create_initial_state());
  const [share_items, set_share_items] = useState<
    ItemsState<ShareItemWithProfile>
  >(create_initial_state());

  const [is_initial_loading, set_is_initial_loading] = useState(true);

  // Fetch Lost Items
  const fetch_lost_items = useCallback(async () => {
    try {
      set_lost_items((prev) => ({ ...prev, is_loading: true, error: null }));

      const response = await fetch(
        "/api/items/lost?status=active&sort=newest&limit=100"
      );
      const data = await response.json();

      if (data.success) {
        set_lost_items({
          items: data.data.items,
          is_loading: false,
          error: null,
          last_fetched: new Date(),
        });
      } else {
        throw new Error(data.error || "Failed to fetch lost items");
      }
    } catch (error) {
      console.error("Failed to fetch lost items:", error);
      set_lost_items((prev) => ({
        ...prev,
        is_loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch lost items",
      }));
    }
  }, []);

  // Fetch Found Items
  const fetch_found_items = useCallback(async () => {
    try {
      set_found_items((prev) => ({ ...prev, is_loading: true, error: null }));

      const response = await fetch(
        "/api/items/found?status=available&sort=newest&limit=100"
      );
      const data = await response.json();

      if (data.success) {
        set_found_items({
          items: data.data.items,
          is_loading: false,
          error: null,
          last_fetched: new Date(),
        });
      } else {
        throw new Error(data.error || "Failed to fetch found items");
      }
    } catch (error) {
      console.error("Failed to fetch found items:", error);
      set_found_items((prev) => ({
        ...prev,
        is_loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch found items",
      }));
    }
  }, []);

  // Fetch Share Items
  const fetch_share_items = useCallback(async () => {
    try {
      set_share_items((prev) => ({ ...prev, is_loading: true, error: null }));

      const response = await fetch(
        "/api/items/share?status=available&sortBy=date&sortOrder=desc&limit=100"
      );
      const data = await response.json();

      if (data.success) {
        set_share_items({
          items: data.data.items,
          is_loading: false,
          error: null,
          last_fetched: new Date(),
        });
      } else {
        throw new Error(data.error || "Failed to fetch share items");
      }
    } catch (error) {
      console.error("Failed to fetch share items:", error);
      set_share_items((prev) => ({
        ...prev,
        is_loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch share items",
      }));
    }
  }, []);

  // Refetch all data
  const refetch_all = useCallback(async () => {
    await Promise.all([
      fetch_lost_items(),
      fetch_found_items(),
      fetch_share_items(),
    ]);
  }, [fetch_lost_items, fetch_found_items, fetch_share_items]);

  // Initial data load on mount
  useEffect(() => {
    const load_initial_data = async () => {
      set_is_initial_loading(true);
      await refetch_all();
      set_is_initial_loading(false);
    };

    load_initial_data();
  }, [refetch_all]);

  const context_value: DataContextType = {
    // Lost Items
    lost_items,
    refetch_lost_items: fetch_lost_items,

    // Found Items
    found_items,
    refetch_found_items: fetch_found_items,

    // Share Items
    share_items,
    refetch_share_items: fetch_share_items,

    // Refetch all
    refetch_all,

    // Global loading state
    is_initial_loading,
  };

  return (
    <DataContext.Provider value={context_value}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Convenience hooks for specific item types
export function useLostItems() {
  const { lost_items, refetch_lost_items } = useData();
  return { ...lost_items, refetch: refetch_lost_items };
}

export function useFoundItems() {
  const { found_items, refetch_found_items } = useData();
  return { ...found_items, refetch: refetch_found_items };
}

export function useShareItems() {
  const { share_items, refetch_share_items } = useData();
  return { ...share_items, refetch: refetch_share_items };
}
