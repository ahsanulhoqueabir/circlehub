"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Eye,
  Clock,
  User,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { LostItem } from "@/lib/mock-data/lost-items";
import { formatTaka } from "@/lib/utils";

interface ItemDetailModalProps {
  item: LostItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
}: ItemDetailModalProps) {
  const [contactRevealed, setContactRevealed] = useState(false);

  if (!isOpen || !item) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const parseContactInfo = (contactInfo: string) => {
    const emailMatch = contactInfo.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = contactInfo.match(
      /\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4}|\d{10}/
    );

    return {
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      raw: contactInfo,
    };
  };

  const contact = parseContactInfo(item.contactInfo);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 backdrop-blur-lg bg-black/20 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Lost Item Details
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Posted {getTimeAgo(item.datePosted)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image */}
              {item.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Main Info */}
              <div
                className={`space-y-4 ${!item.imageUrl ? "lg:col-span-2" : ""}`}
              >
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                      {item.category}
                    </span>
                    {item.rewardAmount && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        ৳{formatTaka(item.rewardAmount)} Reward
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        item.status === "active"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : item.status === "found"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Location
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Date Lost
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(item.dateLost)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Views
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.views} views
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Posted
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(item.datePosted)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Info & Contact */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {item.reportedBy.avatar ? (
                      <Image
                        src={item.reportedBy.avatar}
                        alt={item.reportedBy.name}
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Reported by {item.reportedBy.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Posted {getTimeAgo(item.datePosted)} • {item.views || 0} views
                    </p>

                    {/* Contact Info */}
                    {!contactRevealed ? (
                      <button
                        onClick={() => setContactRevealed(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Show Contact Information
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-500" />
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {!contact.email && !contact.phone && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {contact.raw}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
