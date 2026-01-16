/**
 * Example Component showing how to use ConfirmDialog
 *
 * This is a reference implementation demonstrating various use cases
 * of the ConfirmDialog component.
 */

"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ConfirmDialogExample() {
  // State for the confirm dialog
  const [confirm_dialog, set_confirm_dialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    variant?: "default" | "danger" | "warning" | "success";
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  // Example functions
  const handleDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Item deleted!");
  };

  const handleDeactivate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("User deactivated!");
  };

  const handleApprove = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Item approved!");
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">ConfirmDialog Examples</h1>

      {/* Danger variant - Delete action */}
      <button
        onClick={() => {
          set_confirm_dialog({
            open: true,
            title: "Delete Item",
            description:
              "Are you sure you want to delete this item? This action cannot be undone.",
            onConfirm: handleDelete,
            variant: "danger",
          });
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete (Danger)
      </button>

      {/* Warning variant - Deactivate action */}
      <button
        onClick={() => {
          set_confirm_dialog({
            open: true,
            title: "Deactivate User",
            description:
              "Are you sure you want to deactivate this user? They won't be able to login.",
            onConfirm: handleDeactivate,
            variant: "warning",
          });
        }}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        Deactivate (Warning)
      </button>

      {/* Success variant - Approve action */}
      <button
        onClick={() => {
          set_confirm_dialog({
            open: true,
            title: "Approve Item",
            description: "Are you sure you want to approve this item?",
            onConfirm: handleApprove,
            variant: "success",
          });
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Approve (Success)
      </button>

      {/* Default variant */}
      <button
        onClick={() => {
          set_confirm_dialog({
            open: true,
            title: "Confirm Action",
            description: "Are you sure you want to proceed with this action?",
            onConfirm: async () => {
              console.log("Action confirmed!");
            },
            variant: "default",
          });
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Confirm (Default)
      </button>

      {/* The ConfirmDialog component - Add at the end of your component */}
      <ConfirmDialog
        open={confirm_dialog.open}
        onOpenChange={(open) =>
          set_confirm_dialog((prev) => ({ ...prev, open }))
        }
        title={confirm_dialog.title}
        description={confirm_dialog.description}
        onConfirm={confirm_dialog.onConfirm}
        variant={confirm_dialog.variant}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
}
