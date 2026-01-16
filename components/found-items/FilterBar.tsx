"use client";

import { Filter, ChevronDown } from "lucide-react";

interface FilterBarProps {
  categories: string[];
  locations: string[];
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onDateRangeChange: (days: number) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  selectedLocation: string;
  selectedDateRange: number;
  selectedSort: string;
}

export default function FilterBar({
  categories,
  locations,
  onCategoryChange,
  onLocationChange,
  onDateRangeChange,
  onSortChange,
  selectedCategory,
  selectedLocation,
  selectedDateRange,
  selectedSort,
}: FilterBarProps) {
  const dateRangeOptions = [
    { label: "All time", value: 0 },
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
  ];

  const sortOptions = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Most viewed", value: "most-viewed" },
    { label: "Least viewed", value: "least-viewed" },
    { label: "Title A-Z", value: "title-a-z" },
    { label: "Title Z-A", value: "title-z-a" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date Found
          </label>
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(Number(e.target.value))}
              className="w-full appearance-none px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sort by
          </label>
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
