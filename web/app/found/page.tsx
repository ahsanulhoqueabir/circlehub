"use client";

import { useState, useMemo } from "react";
import { MapPin, Plus, Grid, List } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { FoundItemWithProfile } from "@/types/items.types";
import { CATEGORIES, LOCATIONS } from "@/lib/mock-data/found-items";
import SearchBar from "@/components/found-items/SearchBar";
import FilterBar from "@/components/found-items/FilterBar";
import ItemCard from "@/components/found-items/ItemCard";
import ItemDetailModal from "@/components/found-items/ItemDetailModal";
import ReportFoundItemForm from "@/components/found-items/ReportFoundItemForm";
import AuthWarningModal from "@/components/AuthWarningModal";
import { useAuth } from "@/contexts/auth-context";
import { useFoundItems } from "@/contexts/data-context";

export default function FoundPage() {
  const axios = useAxios();
  const { isAuthenticated } = useAuth();
  const {
    items: context_items,
    is_loading: context_loading,
    error: context_error,
    refetch: refetch_found_items,
  } = useFoundItems();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState("newest");

  // Modals
  const [selectedItem, setSelectedItem] = useState<FoundItemWithProfile | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Client-side filtering and sorting
  const filteredItems = useMemo(() => {
    let filtered = [...context_items];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter((item) => item.location === selectedLocation);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter by date range
    if (selectedDateRange > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - selectedDateRange);
      filtered = filtered.filter(
        (item) => new Date(item.date_found) >= cutoffDate,
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    context_items,
    selectedCategory,
    selectedLocation,
    searchQuery,
    selectedDateRange,
    selectedSort,
  ]);

  const handleItemClick = (item: FoundItemWithProfile) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    setShowReportForm(true);
  };

  const handleReportSubmit = async (formData: {
    title: string;
    description: string;
    category: string;
    location: string;
    dateFound: string;
    imageUrl?: string;
    imageBase64?: string;
    tags?: string[];
  }) => {
    try {
      const response = await axios.post("/api/items/found", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        dateFound: formData.dateFound,
        imageBase64: formData.imageBase64,
        tags: formData.tags,
      });

      if (response.data.success) {
        // Refresh context data
        await refetch_found_items();
        return;
      }

      throw new Error(response.data.error || "Failed to create item");
    } catch (error) {
      console.error("Failed to report item:", error);
      throw error;
    }
  };

  const statsData = [
    {
      label: "Total Found Items",
      value: context_items.length.toString(),
      color: "text-green-600",
    },
    {
      label: "Available Items",
      value: context_items
        .filter((item) => item.status === "available")
        .length.toString(),
      color: "text-blue-600",
    },
    {
      label: "Items Claimed/Returned",
      value: context_items
        .filter(
          (item) => item.status === "claimed" || item.status === "returned",
        )
        .length.toString(),
      color: "text-purple-600",
    },
    {
      label: "This Week",
      value: context_items
        .filter((item) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(item.created_at) > weekAgo;
        })
        .length.toString(),
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            Found Items
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
            Post items you&apos;ve found and help reunite them with their owners
          </p>

          <button
            onClick={handleReportClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 min-h-11 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Report Found Item
          </button>
        </div>

        {/* Error State */}
        {context_error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-center">
              {context_error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {context_loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading items...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-center border border-border hover:shadow-md transition-shadow"
                >
                  <div
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1 sm:mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search found items by title, description, location, or tags..."
              />
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <FilterBar
                categories={CATEGORIES}
                locations={LOCATIONS}
                onCategoryChange={setSelectedCategory}
                onLocationChange={setSelectedLocation}
                onDateRangeChange={setSelectedDateRange}
                onSortChange={setSelectedSort}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                selectedDateRange={selectedDateRange}
                selectedSort={selectedSort}
              />
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "Item" : "Items"} Found
                </h2>
                {searchQuery && (
                  <span className="text-sm text-muted-foreground">
                    for &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 sm:p-3 rounded-md transition-all min-h-11 min-w-11 flex items-center justify-center ${
                    viewMode === "grid"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-muted"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 sm:p-3 rounded-md transition-all min-h-11 min-w-11 flex items-center justify-center ${
                    viewMode === "list"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm"
                      : "text-slate-400 hover:text-foreground hover:bg-muted"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : "No found items have been reported yet"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleReportClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 min-h-11 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Report the First Found Item
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 lg:gap-6 space-y-0"
                    : "space-y-3 sm:space-y-4"
                }
              >
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={
                      viewMode === "grid"
                        ? "break-inside-avoid mb-4 sm:mb-5 lg:mb-6"
                        : ""
                    }
                  >
                    <ItemCard item={item} onClick={handleItemClick} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (for pagination in real app) */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-8 sm:mt-12">
                <button className="px-6 py-3 sm:px-8 sm:py-3.5 border-2 border-border text-foreground rounded-lg hover:bg-muted font-medium transition-all hover:shadow-md active:scale-95 min-h-11 text-sm sm:text-base">
                  Load More Items
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
        }}
        onClaimSuccess={() => {
          refetch_found_items();
        }}
      />

      <ReportFoundItemForm
        isOpen={showReportForm}
        onClose={() => setShowReportForm(false)}
        onSubmit={handleReportSubmit}
      />

      <AuthWarningModal
        isOpen={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
      />
    </div>
  );
}
