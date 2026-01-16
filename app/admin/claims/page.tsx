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

export default function ClaimsPage() {
  const { claims, loading, fetch_claims, approve_claim, reject_claim } =
    useAdmin();

  const [status_filter, set_status_filter] = useState("");
  const [selected_claim, set_selected_claim] = useState<any>(null);
  const [action_modal, set_action_modal] = useState<
    "approve" | "reject" | "view" | null
  >(null);
  const [reject_reason, set_reject_reason] = useState("");

  useEffect(() => {
    fetch_claims({ status: status_filter });
  }, [fetch_claims, status_filter]);

  const handle_approve = async () => {
    if (selected_claim) {
      await approve_claim(selected_claim._id);
      set_action_modal(null);
      set_selected_claim(null);
    }
  };

  const handle_reject = async () => {
    if (selected_claim && reject_reason) {
      await reject_claim(selected_claim._id, reject_reason);
      set_action_modal(null);
      set_reject_reason("");
      set_selected_claim(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
        <button
          onClick={() => fetch_claims({ status: status_filter })}
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
            value={status_filter}
            onChange={(e) => set_status_filter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-sm text-gray-600">
            Total: <strong>{claims.length}</strong> claims
          </span>
        </div>
      </div>

      {/* Claims Table */}
      {loading.claims ? (
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
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Claimant
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
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {claim.item_id?.images?.[0] && (
                          <img
                            src={claim.item_id.images[0]}
                            alt=""
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {claim.item_id?.title || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {claim.item_id?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {claim.claimant_id?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {claim.claimant_id?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          claim.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : claim.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : claim.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(claim.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            set_selected_claim(claim);
                            set_action_modal("view");
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {claim.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                set_selected_claim(claim);
                                set_action_modal("approve");
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                set_selected_claim(claim);
                                set_action_modal("reject");
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
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
        open={action_modal === "view" && !!selected_claim}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_claim(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Item:
              </span>
              <p className="text-sm text-gray-900">
                {selected_claim?.item_id?.title}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Claimant:
              </span>
              <p className="text-sm text-gray-900">
                {selected_claim?.claimant_id?.name} (
                {selected_claim?.claimant_id?.email})
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Status:
              </span>
              <p className="text-sm text-gray-900">
                {selected_claim?.status}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Verification Answers:
              </span>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded mt-1 overflow-auto">
                {JSON.stringify(
                  selected_claim?.verification_answers,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Modals */}
      <Dialog
        open={action_modal === "approve" && !!selected_claim}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_selected_claim(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Claim</DialogTitle>
            <DialogDescription>
              Approve claim for <strong>{selected_claim?.item_id?.title}</strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => set_action_modal(null)}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handle_approve}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg"
            >
              Approve
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={action_modal === "reject" && !!selected_claim}
        onOpenChange={(open) => {
          if (!open) {
            set_action_modal(null);
            set_reject_reason("");
            set_selected_claim(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Claim</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this claim.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={reject_reason}
              onChange={(e) => set_reject_reason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Rejection reason..."
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                set_action_modal(null);
                set_reject_reason("");
              }}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handle_reject}
              disabled={!reject_reason}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg disabled:opacity-50"
            >
              Reject
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
