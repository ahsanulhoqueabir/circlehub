"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Search, MapPin, Eye } from "lucide-react";
import Link from "next/link";

const EmptyState = ({ type }: { type: "lost" | "found" }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
      {type === "lost" ? (
        <Search className="w-8 h-8 text-gray-400" />
      ) : (
        <MapPin className="w-8 h-8 text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No {type} items yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">
      {type === "lost"
        ? "You haven't reported any lost items yet."
        : "You haven't reported any found items yet."}
    </p>
    <Link
      href="/share"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Report {type === "lost" ? "Lost" : "Found"} Item
    </Link>
  </div>
);

export default function MyItemsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate loading items - replace with actual API calls
      setTimeout(() => {
        setLostItems([]);
        setFoundItems([]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Items</h1>
                <p className="text-green-100">
                  Manage your lost and found items
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("lost")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "lost"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Lost Items ({lostItems.length})
              </button>
              <button
                onClick={() => setActiveTab("found")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "found"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Found Items ({foundItems.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "lost" ? (
              lostItems.length === 0 ? (
                <EmptyState type="lost" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Lost items will be mapped here */}
                </div>
              )
            ) : foundItems.length === 0 ? (
              <EmptyState type="found" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Found items will be mapped here */}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Report new items or browse existing ones
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/share"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Report Item
                </Link>
                <Link
                  href="/lost"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
