"use client";

import { AdminProvider } from "@/contexts/admin-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Search,
  Sparkles,
  Handshake,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebar_open, set_sidebar_open] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const nav_items = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Lost Items", path: "/admin/lost-items", icon: Search },
    { name: "Found Items", path: "/admin/found-items", icon: Sparkles },
    { name: "Share Items", path: "/admin/share-items", icon: Handshake },
    { name: "Claims", path: "/admin/claims", icon: ClipboardList },
    { name: "Reports", path: "/admin/reports", icon: AlertTriangle },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
    { name: "Audit Logs", path: "/admin/logs", icon: FileText },
  ];

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebar_open ? "w-64" : "w-20"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              {sidebar_open && (
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              )}
              <button
                onClick={() => set_sidebar_open(!sidebar_open)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebar_open ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {nav_items.map((item) => {
                const is_active =
                  pathname === item.path ||
                  (item.path !== "/admin" && pathname.startsWith(item.path));
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      is_active
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent size={20} />
                    {sidebar_open && (
                      <span className="text-sm">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {sidebar_open && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Admin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
