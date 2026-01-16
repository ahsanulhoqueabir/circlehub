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
    null
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
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by date range
    if (selectedDateRange > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - selectedDateRange);
      filtered = filtered.filter(
        (item) => new Date(item.date_found) >= cutoffDate
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
          (item) => item.status === "claimed" || item.status === "returned"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Found Items
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Post items you&apos;ve found and help reunite them with their owners
          </p>

          <button
            onClick={handleReportClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
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
              <p className="text-slate-600 dark:text-slate-300">
                Loading items...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700"
                >
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search found items by title, description, location, or tags..."
              />
            </div>

            {/* Filters */}
            <div className="mb-6">
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "Item" : "Items"} Found
                </h2>
                {searchQuery && (
                  <span className="text-slate-600 dark:text-slate-400">
                    for &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No items found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : "No found items have been reported yet"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleReportClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Report the First Found Item
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                    : "space-y-4"
                }
              >
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={
                      viewMode === "grid" ? "break-inside-avoid mb-6" : ""
                    }
                  >
                    <ItemCard item={item} onClick={handleItemClick} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (for pagination in real app) */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
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
