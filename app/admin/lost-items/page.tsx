"use client";

import { useAdmin } from "@/contexts/admin-context";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw, Package } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LostItemsPage() {
  const {
    lost_items,
    loading,
    fetch_lost_items,
    approve_item,
    reject_item,
    delete_item,
  } = useAdmin();

  const [search, set_search] = useState("");
  const [status_filter, set_status_filter] = useState("");
  const [category_filter, set_category_filter] = useState("");
  const [selected_item, set_selected_item] = useState<any>(null);
  const [action_modal, set_action_modal] = useState<
    "approve" | "reject" | "delete" | "view" | null
  >(null);
  const [reject_reason, set_reject_reason] = useState("");

  useEffect(() => {
    fetch_lost_items({
      search,
      status: status_filter,
      category: category_filter,
    });
  }, [fetch_lost_items, search, status_filter, category_filter]);

  const handle_approve = async () => {
    if (selected_item) {
      await approve_item(selected_item._id, "lost");
      set_action_modal(null);
      set_selected_item(null);
    }
  };

  const handle_reject = async () => {
    if (selected_item && reject_reason) {
      await reject_item(selected_item._id, "lost", reject_reason);
      set_action_modal(null);
      set_reject_reason("");
      set_selected_item(null);
    }
  };

  const handle_delete = async () => {
    if (selected_item) {
      await delete_item(selected_item._id, "lost");
      set_action_modal(null);
      set_selected_item(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Lost Items Management
        </h1>
        <button
          onClick={() =>
            fetch_lost_items({
              search,
              status: status_filter,
              category: category_filter,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => set_search(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <select
              value={status_filter}
              onChange={(e) => set_status_filter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <select
              value={category_filter}
              onChange={(e) => set_category_filter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Total: <strong>{lost_items.length}</strong> items
            </span>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading.items ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lost_items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div
                className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  set_selected_item(item);
                  set_action_modal("view");
                }}
              >
                {item.images?.[0] ? (
                  <Image
                    fill
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={40} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ml-2 ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : item.status === "resolved"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {item.category}
                  </span>
                  {item.location && (
                    <span className="truncate">📍 {item.location}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b">
                  <span>By {item.user_id?.name || "Unknown"}</span>
                  <span>
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      set_selected_item(item);
                      set_action_modal("approve");
                    }}
                    className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => {
                      set_selected_item(item);
                      set_action_modal("reject");
                    }}
                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    ✗ Reject
                  </button>
                  <button
                    onClick={() => {
                      set_selected_item(item);
                      set_action_modal("delete");
                    }}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Dialog
        open={action_modal === "view" && !!selected_item}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_item(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected_item?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selected_item?.images?.map((img: string, idx: number) => (
                <div key={idx} className="relative w-full h-48">
                  <Image
                    fill
                    src={img}
                    alt=""
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Description:
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {selected_item?.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Category:
                  </span>
                  <p className="text-sm text-gray-600">
                    {selected_item?.category}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <p className="text-sm text-gray-600">
                    {selected_item?.status}
                  </p>
                </div>
                {selected_item?.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Location:
                    </span>
                    <p className="text-sm text-gray-600">
                      {selected_item.location}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Posted:
                  </span>
                  <p className="text-sm text-gray-600">
                    {selected_item &&
                      formatDistanceToNow(new Date(selected_item.created_at), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Posted by:
                </span>
                <p className="text-sm text-gray-600">
                  {selected_item?.user_id?.name} (
                  {selected_item?.user_id?.email})
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={action_modal === "approve" && !!selected_item}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_item(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve{" "}
              <strong>{selected_item?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handle_approve}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={action_modal === "reject" && !!selected_item}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_reject_reason("");
            set_selected_item(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this item.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection
            </label>
            <textarea
              value={reject_reason}
              onChange={(e) => set_reject_reason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter reason..."
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                set_action_modal(null);
                set_reject_reason("");
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handle_reject}
              disabled={!reject_reason}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={action_modal === "delete" && !!selected_item}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_item(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selected_item?.title}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handle_delete}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
