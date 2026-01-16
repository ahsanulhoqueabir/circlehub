"use client";

import { useAdmin } from "@/contexts/admin-context";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";

export default function UsersPage() {
  const { users, loading, fetch_users, ban_user, unban_user, update_user } =
    useAdmin();

  const [search, set_search] = useState("");
  const [status_filter, set_status_filter] = useState("");
  const [selected_user, set_selected_user] = useState<any>(null);
  const [action_modal, set_action_modal] = useState<
    "ban" | "unban" | "edit" | null
  >(null);
  const [ban_reason, set_ban_reason] = useState("");

  useEffect(() => {
    fetch_users({ search, status: status_filter });
  }, [fetch_users, search, status_filter]);

  const handle_ban = async () => {
    if (selected_user && ban_reason) {
      await ban_user(selected_user._id, ban_reason);
      set_action_modal(null);
      set_ban_reason("");
      set_selected_user(null);
    }
  };

  const handle_unban = async () => {
    if (selected_user) {
      await unban_user(selected_user._id);
      set_action_modal(null);
      set_selected_user(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => fetch_users({ search, status: status_filter })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => set_search(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={status_filter}
              onChange={(e) => set_status_filter(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Total: <strong>{users.length}</strong> users
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        {loading.users ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.name}
                          </div>
                          {user.student_id && (
                            <div className="text-xs text-gray-500">
                              ID: {user.student_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-xs text-gray-500">
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs rounded inline-block w-fit ${
                            user.is_banned
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.is_banned ? "Banned" : "Active"}
                        </span>
                        {user.is_verified && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 inline-block w-fit">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {user.is_banned ? (
                          <button
                            onClick={() => {
                              set_selected_user(user);
                              set_action_modal("unban");
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              set_selected_user(user);
                              set_action_modal("ban");
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ban Modal */}
      {action_modal === "ban" && selected_user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Ban User: {selected_user.name}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for banning
              </label>
              <textarea
                value={ban_reason}
                onChange={(e) => set_ban_reason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter reason for banning this user..."
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  set_action_modal(null);
                  set_ban_reason("");
                  set_selected_user(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handle_ban}
                disabled={!ban_reason}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Modal */}
      {action_modal === "unban" && selected_user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Unban User: {selected_user.name}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to unban this user? They will regain full
              access to the platform.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  set_action_modal(null);
                  set_selected_user(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handle_unban}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Unban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
