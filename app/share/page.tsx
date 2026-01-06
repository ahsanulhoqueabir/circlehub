"use client";

import { useState, useMemo, useEffect } from "react";
import { Share2, Plus } from "lucide-react";
import SearchBar from "@/components/share-items/SearchBar";
import FilterBar from "@/components/share-items/FilterBar";
import ItemCard from "@/components/share-items/ItemCard";
import ItemDetailModal from "@/components/share-items/ItemDetailModal";
import ReportShareItemForm from "@/components/share-items/ReportShareItemForm";
import {
  ShareItemWithProfile,
  CreateShareItemRequest,
} from "@/types/items.types";
import { useAxios } from "@/hooks/use-axios";

export default function SharePage() {
  const axios = useAxios();
  const [items, setItems] = useState<ShareItemWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ShareItemWithProfile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/items/share");
      if (response.data.success) {
        setItems(response.data.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch share items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory.toLowerCase();

      const matchesCondition =
        selectedCondition === "all" || item.condition === selectedCondition;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        item.status === "active"
      );
    });
  }, [items, searchTerm, selectedCategory, selectedCondition]);

  const handleItemClick = (item: ShareItemWithProfile) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleReportSubmit = async (itemData: CreateShareItemRequest) => {
    try {
      const response = await axios.post("/api/items/share", itemData);
      if (response.data.success) {
        // Refetch items to include the new one
        await fetchItems();
        setIsReportFormOpen(false);
        alert("Item shared successfully!");
      }
    } catch (error: any) {
      console.error("Failed to share item:", error);
      alert(error.response?.data?.error || "Failed to share item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Share Items
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Give away items you no longer need to fellow students in your
            community
          </p>

          {/* Share Item Button */}
          <button
            onClick={() => setIsReportFormOpen(true)}
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Share an Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <FilterBar
            selectedCategory={selectedCategory}
            selectedCondition={selectedCondition}
            onCategoryChange={setSelectedCategory}
            onConditionChange={setSelectedCondition}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-300">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {/* Items Grid - Masonry Layout */}
        {filteredItems.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {searchTerm ||
              selectedCategory !== "All Categories" ||
              selectedCondition !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to share an item!"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />

      <ReportShareItemForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
