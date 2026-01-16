"use client";

import { useAdmin } from "@/contexts/admin-context";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";

export default function LogsPage() {
  const { audit_logs, loading, fetch_audit_logs } = useAdmin();

  const [action_filter, set_action_filter] = useState("");

  useEffect(() => {
    fetch_audit_logs({ action: action_filter });
  }, [fetch_audit_logs, action_filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <button
          onClick={() => fetch_audit_logs({ action: action_filter })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <select
            value={action_filter}
            onChange={(e) => set_action_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Actions</option>
            <option value="ban_user">Ban User</option>
            <option value="unban_user">Unban User</option>
            <option value="update_user">Update User</option>
            <option value="delete_user">Delete User</option>
            <option value="approve_item">Approve Item</option>
            <option value="reject_item">Reject Item</option>
            <option value="approve_claim">Approve Claim</option>
            <option value="reject_claim">Reject Claim</option>
            <option value="resolve_report">Resolve Report</option>
          </select>
          <span className="text-sm text-gray-600">
            Total: <strong>{audit_logs.length}</strong> logs
          </span>
        </div>
      </div>

      {/* Logs Table */}
      {loading.logs ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audit_logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {log.admin_id?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.admin_id?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {log.target_type}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">
                        {log.target_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 max-w-[200px] truncate">
                        {JSON.stringify(log.details)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
