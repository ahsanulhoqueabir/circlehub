"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Share2,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Search,
      title: "Lost Items",
      description:
        "Report and search for lost items with detailed descriptions and photos",
      href: "/lost",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: MapPin,
      title: "Found Items",
      description: "Help others by posting items you've found around campus",
      href: "/found",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Share2,
      title: "Share Items",
      description: "Give away items you no longer need to fellow students",
      href: "/share",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  const stats = [
    { label: "Items Recovered", value: "1,234", icon: MapPin },
    { label: "Active Users", value: "5,678", icon: Users },
    { label: "Items Shared", value: "2,890", icon: Share2 },
    { label: "Success Rate", value: "87%", icon: Star },
  ];

  const recentActivity = [
    {
      type: "found",
      item: "Blue Backpack",
      location: "Library Entrance",
      time: "2 hours ago",
    },
    {
      type: "lost",
      item: "iPhone 14 Pro",
      location: "Engineering Building",
      time: "4 hours ago",
    },
    {
      type: "share",
      item: "Calculus Textbook",
      location: "Student Center",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-size-[20px_20px] mask-[radial-gradient(ellipse_800px_600px_at_center,white,transparent)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              CircleHub{" "}
              <span className="text-blue-600 dark:text-blue-400">JnU</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              The modern platform for JnU lost & found, sharing items, and
              connecting with your campus community
            </p>

            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Welcome back,{" "}
                  <span className="font-semibold">{user?.name}</span>!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/lost"
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Report Lost Item
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    href="/found"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Report Found Item
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How CircleHub JnU Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Simple, secure, and effective way to manage lost and found items
              in your JnU campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-white dark:bg-slate-800 hover:shadow-lg"
                >
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              See what&apos;s happening in your JnU community
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    activity.type === "found"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : activity.type === "lost"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-yellow-100 dark:bg-yellow-900/30"
                  }`}
                >
                  {activity.type === "found" && (
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                  {activity.type === "lost" && (
                    <Search className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  {activity.type === "share" && (
                    <Share2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {activity.item}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {activity.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/activity"
              className="inline-flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              View All Activity
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Secure & Trusted Platform
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Your safety and privacy are our top priorities. All users are
            verified university students, and all communications are secure and
            monitored.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Verified Students Only
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Community Driven
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
