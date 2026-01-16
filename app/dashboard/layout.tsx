"use client";

import { AdminProvider } from "@/contexts/admin-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { filterDashboardRoutes } from "@/utils/navigation-filter";
import type { UserRole } from "@/config/routes.config";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Get filtered navigation items based on user role
  const nav_items = useMemo(() => {
    if (!user) return [];
    return filterDashboardRoutes(user.role as UserRole);
  }, [user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (after loading is done)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Don't render anything until authentication is confirmed
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // At this point, user must exist (isAuthenticated is true)
  if (!user) {
    return null;
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex">
        {/* Sidebar */}
        <DashboardSidebar
          nav_items={nav_items}
          title={user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
          user_role_label={
            user.role === "admin"
              ? "Administrator"
              : user.role === "moderator"
              ? "Moderator"
              : user.role === "support_staff"
              ? "Support Staff"
              : "User"
          }
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
