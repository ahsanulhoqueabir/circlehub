"use client";

import { useAdmin } from "@/contexts/admin-context";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReportsPage() {
  const { reports, loading, fetch_reports, resolve_report } = useAdmin();

  const [status_filter, set_status_filter] = useState("");
  const [priority_filter, set_priority_filter] = useState("");
  const [selected_report, set_selected_report] = useState<any>(null);
  const [action_modal, set_action_modal] = useState<"resolve" | "view" | null>(
    null
  );
  const [resolution, set_resolution] = useState("");

  useEffect(() => {
    fetch_reports({ status: status_filter, priority: priority_filter });
  }, [fetch_reports, status_filter, priority_filter]);

  const handle_resolve = async () => {
    if (selected_report && resolution) {
      await resolve_report(selected_report._id, resolution);
      set_action_modal(null);
      set_resolution("");
      set_selected_report(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Reports & Flagged Content
        </h1>
        <button
          onClick={() =>
            fetch_reports({ status: status_filter, priority: priority_filter })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <select
            value={status_filter}
            onChange={(e) => set_status_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <select
            value={priority_filter}
            onChange={(e) => set_priority_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span className="text-sm text-gray-600">
            Total: <strong>{reports.length}</strong> reports
          </span>
        </div>
      </div>

      {/* Reports Table */}
      {loading.reports ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type & Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-muted">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {report.reported_type}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {report.reported_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">
                        {report.reporter_id?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.reporter_id?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">
                        {report.reason}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          report.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : report.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : report.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "dismissed"
                            ? "bg-muted text-foreground"
                            : report.status === "under_review"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(report.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            set_selected_report(report);
                            set_action_modal("view");
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {report.status !== "resolved" && (
                          <button
                            onClick={() => {
                              set_selected_report(report);
                              set_action_modal("resolve");
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Dialog
        open={action_modal === "view" && !!selected_report}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_report(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <span className="font-medium">Type:</span>{" "}
              {selected_report?.reported_type}
            </div>
            <div>
              <span className="font-medium">Target ID:</span>{" "}
              {selected_report?.reported_id}
            </div>
            <div>
              <span className="font-medium">Reporter:</span>{" "}
              {selected_report?.reporter_id?.name} (
              {selected_report?.reporter_id?.email})
            </div>
            <div>
              <span className="font-medium">Reason:</span>{" "}
              {selected_report?.reason}
            </div>
            <div>
              <span className="font-medium">Description:</span>
              <p className="text-sm text-gray-600 mt-1">
                {selected_report?.description}
              </p>
            </div>
            <div>
              <span className="font-medium">Priority:</span>{" "}
              {selected_report?.priority}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {selected_report?.status}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="w-full px-4 py-2 bg-muted rounded-lg"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Modal */}
      <Dialog
        open={action_modal === "resolve" && !!selected_report}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_resolution("");
            set_selected_report(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Provide resolution notes for this report.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={resolution}
              onChange={(e) => set_resolution(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Resolution notes..."
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                set_action_modal(null);
                set_resolution("");
              }}
              className="px-4 py-2 text-sm bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handle_resolve}
              disabled={!resolution}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg disabled:opacity-50"
            >
              Resolve
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
