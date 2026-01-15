"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Grid, List } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { LostItemWithProfile } from "@/types/items.types";
import { CATEGORIES, LOCATIONS } from "@/lib/mock-data/lost-items";
import SearchBar from "@/components/lost-items/SearchBar";
import FilterBar from "@/components/lost-items/FilterBar";
import ItemCard from "@/components/lost-items/ItemCard";
import ItemDetailModal from "@/components/lost-items/ItemDetailModal";
import ReportLostItemForm from "@/components/lost-items/ReportLostItemForm";
import AuthWarningModal from "@/components/AuthWarningModal";
import { useAuth } from "@/contexts/auth-context";

export default function LostPage() {
  const axios = useAxios();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<LostItemWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState("newest");

  // Modals
  const [selectedItem, setSelectedItem] = useState<LostItemWithProfile | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch items from API
  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedLocation, selectedSort, searchQuery]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: "active",
        sort: selectedSort,
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (selectedLocation !== "all") {
        params.append("location", selectedLocation);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await axios.get(`/api/items/lost?${params.toString()}`);

      if (response.data.success) {
        setItems(response.data.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute filtered items using useMemo to avoid cascading renders
  const filteredItems = useMemo(() => {
    return items;
  }, [items]);

  const handleItemClick = (item: LostItemWithProfile) => {
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
    dateLost: string;
    contactInfo: string;
    rewardAmount?: number;
    imageUrl?: string;
    imageBase64?: string;
    tags?: string[];
  }) => {
    try {
      const response = await axios.post("/api/items/lost", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        dateLost: formData.dateLost,
        contactInfo: formData.contactInfo,
        imageBase64: formData.imageBase64,
        tags: formData.tags,
        rewardAmount: formData.rewardAmount,
      });

      if (response.data.success) {
        // Refresh items list
        await fetchItems();
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
      label: "Total Lost Items",
      value: items.length.toString(),
      color: "text-red-600",
    },
    {
      label: "Active Reports",
      value: items.filter((item) => item.status === "active").length.toString(),
      color: "text-blue-600",
    },
    {
      label: "Items Resolved",
      value: items
        .filter((item) => item.status === "resolved")
        .length.toString(),
      color: "text-green-600",
    },
    {
      label: "This Week",
      value: items
        .filter((item) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(item.created_at) > weekAgo;
        })
        .length.toString(),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lost Items
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Report items you&apos;ve lost and search through items found by
            other students
          </p>

          <button
            onClick={handleReportClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Report Lost Item
          </button>
        </div>

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
            placeholder="Search lost items by title, description, location, or tags..."
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
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "No lost items have been reported yet"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleReportClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Report the First Lost Item
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
                key={item.id}
                className={viewMode === "grid" ? "break-inside-avoid mb-6" : ""}
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
      </div>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
        }}
      />

      <ReportLostItemForm
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
