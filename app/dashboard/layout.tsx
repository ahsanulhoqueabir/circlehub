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

  // Debug logging
  useEffect(() => {
    console.log("Dashboard Layout State:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
    });
  }, [isLoading, isAuthenticated, user]);

  // Get filtered navigation items based on user role
  const nav_items = useMemo(() => {
    if (!user) return [];
    return filterDashboardRoutes(user.role as UserRole);
  }, [user]);

  // Redirect to login if not authenticated - only after loading is complete
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Dashboard: Not authenticated, redirecting to login");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything until authentication is confirmed
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen flex">
        {/* Sidebar - Fixed/Sticky */}
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

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-auto h-screen">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
