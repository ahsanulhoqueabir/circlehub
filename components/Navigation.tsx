"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  MapPin,
  Share2,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BookOpen,
  Bell,
  Package,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/auth-context";

export default function Navigation() {
  const pathname = usePathname();
  const { setTheme, actualTheme, mounted } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Lost",
      href: "/lost",
      icon: Search,
    },
    {
      name: "Found",
      href: "/found",
      icon: MapPin,
    },
    {
      name: "Share",
      href: "/share",
      icon: Share2,
    },
  ];

  const toggleTheme = () => {
    const newTheme = actualTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CH</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 hidden sm:block">
                  CircleHub JnU
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side - Theme Toggle, User Menu */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={
                  mounted
                    ? `Switch to ${
                        actualTheme === "light" ? "dark" : "light"
                      } mode`
                    : "Toggle theme"
                }
              >
                {!mounted ? (
                  <div className="w-5 h-5" /> // Placeholder to prevent layout shift
                ) : actualTheme === "light" ? (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              {/* User Menu - Desktop Only */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <Link
                        href="/my-items"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>My Items</span>
                      </Link>

                      <Link
                        href="/claims"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>Claims</span>
                      </Link>

                      <Link
                        href="/notifications"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </Link>

                      <hr className="border-slate-200 dark:border-slate-700 my-1" />

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 pb-safe">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Mobile User Menu in Bottom Nav */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isDropdownOpen
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Profile</span>
              </button>

              {/* Mobile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/my-items"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Items</span>
                  </Link>

                  <Link
                    href="/notifications"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>

                  <hr className="border-slate-200 dark:border-slate-700 my-1" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
