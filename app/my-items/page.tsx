"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Search, MapPin, Eye, Gift, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LostItem, FoundItem, ShareItem } from "@/types/items.types";
import ItemCard from "@/components/my-items/ItemCard";
import ItemDetailsModal from "@/components/my-items/ItemDetailsModal";
import EditItemModal from "@/components/my-items/EditItemModal";
import ConfirmDialog from "@/components/my-items/ConfirmDialog";
import useAxios from "@/hooks/use-axios";

const EmptyState = ({ type }: { type: "lost" | "found" | "share" }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
      {type === "lost" ? (
        <Search className="w-8 h-8 text-gray-400" />
      ) : type === "found" ? (
        <MapPin className="w-8 h-8 text-gray-400" />
      ) : (
        <Gift className="w-8 h-8 text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">
      No {type} items yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">
      {type === "lost"
        ? "You haven't reported any lost items yet."
        : type === "found"
          ? "You haven't reported any found items yet."
          : "You haven't shared any items yet."}
    </p>
    <Link
      href="/share"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Report {type === "lost" ? "Lost" : type === "found" ? "Found" : "Share"}{" "}
      Item
    </Link>
  </div>
);

export default function MyItemsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const axios = useAxios();

  const [activeTab, setActiveTab] = useState<"lost" | "found" | "share">(
    "lost",
  );
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [shareItems, setShareItems] = useState<ShareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<
    LostItem | FoundItem | ShareItem | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const fetchAllItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [lostRes, foundRes, shareRes] = await Promise.all([
        axios.get(`/api/items/lost?userId=${user?.id}&status=all`),
        axios.get(`/api/items/found?userId=${user?.id}&status=all`),
        axios.get(`/api/items/share?userId=${user?.id}&status=all`),
      ]);

      if (lostRes.data.success) {
        setLostItems(lostRes.data.data.items || []);
      }
      if (foundRes.data.success) {
        setFoundItems(foundRes.data.data.items || []);
      }
      if (shareRes.data.success) {
        setShareItems(shareRes.data.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load your items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view item
  const handleView = (item: LostItem | FoundItem | ShareItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  // Handle edit item
  const handleEdit = (item: LostItem | FoundItem | ShareItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Handle delete item
  const handleDelete = (item: LostItem | FoundItem | ShareItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Save edited item
  const handleSaveEdit = async (
    itemId: string,
    updatedData: Partial<LostItem | FoundItem | ShareItem>,
  ) => {
    try {
      const endpoint = `/api/items/${activeTab}/${itemId}`;
      const response = await axios.put(endpoint, updatedData);

      if (response.data.success) {
        // Refresh items to get updated data from server
        await fetchAllItems();
      }
    } catch (err) {
      console.error("Error updating item:", err);
      throw err;
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const endpoint = `/api/items/${activeTab}/${selectedItem._id}`;
      const response = await axios.delete(endpoint);

      if (response.data.success) {
        // Remove item from local state
        if (activeTab === "lost") {
          setLostItems((prev) =>
            prev.filter((item) => item._id !== selectedItem._id),
          );
        } else if (activeTab === "found") {
          setFoundItems((prev) =>
            prev.filter((item) => item._id !== selectedItem._id),
          );
        } else if (activeTab === "share") {
          setShareItems((prev) =>
            prev.filter((item) => item._id !== selectedItem._id),
          );
        }

        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getCurrentItems = () => {
    if (activeTab === "lost") return lostItems;
    if (activeTab === "found") return foundItems;
    return shareItems;
  };

  const currentItems = getCurrentItems();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your items...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow rounded-lg overflow-hidden">
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

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={fetchAllItems}
                  className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-border">
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
              <button
                onClick={() => setActiveTab("share")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "share"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Share Items ({shareItems.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentItems.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    type={activeTab}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-muted px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium text-foreground">
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
                  className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ItemDetailsModal
        item={selectedItem}
        type={activeTab}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedItem(null);
        }}
      />

      <EditItemModal
        item={selectedItem}
        type={activeTab}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
