"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Share2,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { HomeStats, RecentActivityItem } from "@/types/items.types";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [current_slide, set_current_slide] = useState(0);

  // Home page data states
  const [home_stats, set_home_stats] = useState<HomeStats | null>(null);
  const [recent_activity, set_recent_activity] = useState<RecentActivityItem[]>(
    []
  );
  const [is_loading_home_data, set_is_loading_home_data] = useState(true);

  const banners = [
    "/banner/banner-1.jpeg",
    "/banner/banner-2.jpeg",
    "/banner/banner-3.jpeg",
  ];

  const next_slide = useCallback(() => {
    set_current_slide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev_slide = useCallback(() => {
    set_current_slide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      next_slide();
    }, 5000);
    return () => clearInterval(interval);
  }, [next_slide]);

  // Fetch home page data
  useEffect(() => {
    const fetch_home_data = async () => {
      try {
        set_is_loading_home_data(true);
        const response = await fetch("/api/home?limit=5");
        const data = await response.json();

        if (data.success) {
          set_home_stats(data.data.stats);
          set_recent_activity(data.data.recent_activity);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        set_is_loading_home_data(false);
      }
    };

    fetch_home_data();
  }, []);

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

  // Dynamic stats from API
  const stats = [
    {
      label: "Items Recovered",
      value: home_stats ? home_stats.items_recovered.toLocaleString() : "--",
      icon: MapPin,
    },
    {
      label: "Active Users",
      value: home_stats ? home_stats.active_users.toLocaleString() : "--",
      icon: Users,
    },
    {
      label: "Items Shared",
      value: home_stats ? home_stats.items_shared.toLocaleString() : "--",
      icon: Share2,
    },
    {
      label: "Success Rate",
      value: home_stats ? `${home_stats.success_rate}%` : "--",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Banner Carousel */}
        <div className="absolute inset-0">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0  transition-opacity duration-1000 ${
                index === current_slide ? "opacity-80" : "opacity-0"
              }`}
            >
              <Image
                src={banner}
                alt={`Campus Banner ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev_slide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next_slide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => set_current_slide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current_slide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <p
                className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto"
                style={{
                  textShadow:
                    "2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                The modern platform for JnU lost & found, sharing items, and
                connecting with your campus community
              </p>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <p
                    className="text-lg text-white"
                    style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}
                  >
                    Welcome back,{" "}
                    <span className="font-semibold">{user?.name}</span>!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/lost"
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                    >
                      Report Lost Item
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    <Link
                      href="/found"
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-lg"
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
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-colors text-lg"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
                  className="group p-8 rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-card hover:shadow-lg"
                >
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
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
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Recent Activity
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              See what&apos;s happening in your JnU community
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {is_loading_home_data ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg border border-border bg-card animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-muted mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : recent_activity.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No recent activity found
              </div>
            ) : (
              recent_activity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center p-4 rounded-lg border border-border bg-card"
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
                      <h3 className="font-medium text-foreground">
                        {activity.title}
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
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/activity"
              className="inline-flex items-center px-6 py-3 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
            >
              View All Activity
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
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
