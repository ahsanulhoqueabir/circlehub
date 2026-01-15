"use client";

import { useState, useMemo, useEffect } from "react";
import { Share2, Plus, Grid, List } from "lucide-react";
import SearchBar from "@/components/share-items/SearchBar";
import FilterBar from "@/components/share-items/FilterBar";
import ItemCard from "@/components/share-items/ItemCard";
import ItemDetailModal from "@/components/share-items/ItemDetailModal";
import ReportShareItemForm from "@/components/share-items/ReportShareItemForm";
import AuthWarningModal from "@/components/AuthWarningModal";
import {
  ShareItemWithProfile,
  CreateShareItemRequest,
} from "@/types/items.types";
import { useAuth } from "@/contexts/auth-context";
import useAxios from "@/hooks/use-axios";

export default function SharePage() {
  const axios = useAxios();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<ShareItemWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedOfferType, setSelectedOfferType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ShareItemWithProfile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const matchesOfferType =
        selectedOfferType === "all" || item.offer_type === selectedOfferType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        matchesOfferType &&
        item.status === "available"
      );
    });
  }, [
    items,
    searchTerm,
    selectedCategory,
    selectedCondition,
    selectedOfferType,
  ]);

  const handleItemClick = (item: ShareItemWithProfile) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    setIsReportFormOpen(true);
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
    } catch (error: unknown) {
      console.error("Failed to share item:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : "Failed to share item";
      alert(errorMessage);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4">
            Share Items
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Give away items you no longer need to fellow students in your
            community
          </p>

          {/* Share Item Button */}
          <button
            onClick={handleReportClick}
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Share an Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <FilterBar
            selectedCategory={selectedCategory}
            selectedCondition={selectedCondition}
            selectedOfferType={selectedOfferType}
            onCategoryChange={setSelectedCategory}
            onConditionChange={setSelectedCondition}
            onOfferTypeChange={setSelectedOfferType}
          />
        </div>

        {/* Results Count and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} available
          </p>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items Grid/List */}
        {filteredItems.length > 0 ? (
          viewMode === "grid" ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 space-y-0">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white mb-2 px-4">
              No items found
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 px-4">
              {searchTerm ||
              selectedCategory !== "All Categories" ||
              selectedCondition !== "all" ||
              selectedOfferType !== "all"
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

      <AuthWarningModal
        isOpen={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
      />
    </div>
  );
}
