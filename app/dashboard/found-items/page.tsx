"use client";

import { useAdmin } from "@/contexts/admin-context";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw, Sparkles } from "lucide-react";
import Image from "next/image";

export default function FoundItemsPage() {
  const {
    found_items,
    loading,
    fetch_found_items,
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
    fetch_found_items({
      search,
      status: status_filter,
      category: category_filter,
    });
  }, [fetch_found_items, search, status_filter, category_filter]);

  const handle_approve = async () => {
    if (selected_item) {
      await approve_item(selected_item._id, "found");
      set_action_modal(null);
      set_selected_item(null);
    }
  };

  const handle_reject = async () => {
    if (selected_item && reject_reason) {
      await reject_item(selected_item._id, "found", reject_reason);
      set_action_modal(null);
      set_reject_reason("");
      set_selected_item(null);
    }
  };

  const handle_delete = async () => {
    if (selected_item) {
      await delete_item(selected_item._id, "found");
      set_action_modal(null);
      set_selected_item(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Found Items Management
        </h1>
        <button
          onClick={() =>
            fetch_found_items({
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
      <div className="bg-card rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => set_search(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={status_filter}
            onChange={(e) => set_status_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={category_filter}
            onChange={(e) => set_category_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="others">Others</option>
          </select>
          <span className="text-sm text-gray-600 flex items-center">
            Total: <strong className="ml-1">{found_items.length}</strong> items
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {loading.items ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {found_items.map((item) => (
            <div
              key={item._id}
              className="bg-card rounded-lg shadow hover:shadow-lg transition-shadow"
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
                    <Sparkles size={40} />
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
                        : item.status === "claimed"
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
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      set_selected_item(item);
                      set_action_modal("reject");
                    }}
                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    ✗
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

      {/* Modals - Same as Lost Items */}
      {action_modal === "view" && selected_item && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => set_action_modal(null)}
        >
          <div
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {selected_item.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {selected_item.images?.map((img: string, idx: number) => (
                  <Image
                    fill
                    key={idx}
                    src={img}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Description:
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {selected_item.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <p className="text-sm text-gray-600">
                      {selected_item.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <p className="text-sm text-gray-600">
                      {selected_item.status}
                    </p>
                  </div>
                  {selected_item.location && (
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
                      {formatDistanceToNow(new Date(selected_item.created_at), {
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
                    {selected_item.user_id?.name} (
                    {selected_item.user_id?.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => set_action_modal(null)}
                className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {action_modal === "approve" && selected_item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Approve Item
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to approve{" "}
              <strong>{selected_item.title}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
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
            </div>
          </div>
        </div>
      )}

      {action_modal === "reject" && selected_item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Reject Item
            </h3>
            <textarea
              value={reject_reason}
              onChange={(e) => set_reject_reason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter reason..."
            />
            <div className="flex items-center justify-end gap-3">
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
            </div>
          </div>
        </div>
      )}

      {action_modal === "delete" && selected_item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Delete Item
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selected_item.title}</strong>? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
