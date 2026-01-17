"use client";

import { useState, useMemo } from "react";
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
import { useShareItems } from "@/contexts/data-context";
import useAxios from "@/hooks/use-axios";

export default function SharePage() {
  const axios = useAxios();
  const { isAuthenticated } = useAuth();
  const {
    items: context_items,
    is_loading: context_loading,
    error: context_error,
    refetch: refetch_share_items,
  } = useShareItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedOfferType, setSelectedOfferType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ShareItemWithProfile | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Client-side filtering
  const filteredItems = useMemo(() => {
    return context_items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
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
    context_items,
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
        // Refetch context data
        await refetch_share_items();
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

  if (context_loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Error State */}
        {context_error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-center">
              {context_error}
            </p>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Share2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4">
            Share Items
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
            Give away items you no longer need to fellow students in your
            community
          </p>

          {/* Share Item Button */}
          <button
            onClick={handleReportClick}
            className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white px-5 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-4 rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 min-h-11 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Share an Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 mb-6 sm:mb-8">
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
          <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} available
          </p>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 sm:p-3 rounded-md transition-all min-h-11 min-w-11 flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-muted"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 sm:p-3 rounded-md transition-all min-h-11 min-w-11 flex items-center justify-center ${
                viewMode === "list"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-muted"
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
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 lg:gap-6 space-y-0">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="break-inside-avoid mb-4 sm:mb-5 lg:mb-6"
                >
                  <ItemCard item={item} onClick={() => handleItemClick(item)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Share2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 sm:mb-8">
              {searchTerm ||
              selectedCategory !== "All Categories" ||
              selectedCondition !== "all" ||
              selectedOfferType !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to share an item!"}
            </p>
            {!searchTerm &&
              selectedCategory === "All Categories" &&
              selectedCondition === "all" &&
              selectedOfferType === "all" && (
                <button
                  onClick={handleReportClick}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 min-h-11 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Share Your First Item
                </button>
              )}
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
