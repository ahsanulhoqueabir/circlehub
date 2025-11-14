"use client";

import { X, Calendar, MapPin, User, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import { ShareItem } from "@/lib/mock-data/share-items";

interface ItemDetailModalProps {
  item: ShareItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "new":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "like-new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "good":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "fair":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "poor":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 backdrop-blur-lg bg-black/20"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Item Details
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl || "/placeholder-image.jpg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Category */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  {item.category}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                    item.condition
                  )}`}
                >
                  {item.condition.charAt(0).toUpperCase() +
                    item.condition.slice(1)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              {item.isActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Available
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Description
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Item Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-5 h-5" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-5 h-5" />
                    <span>Posted {formatDate(item.datePosted)}</span>
                  </div>
                  {item.availability && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock className="w-5 h-5" />
                      <span>{item.availability}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <User className="w-5 h-5" />
                    <span>{item.contactInfo.name}</span>
                  </div>
                  {item.contactInfo.phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="w-5 h-5" />
                      <a
                        href={`tel:${item.contactInfo.phone}`}
                        className="hover:text-yellow-600"
                      >
                        {item.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {item.contactInfo.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-5 h-5" />
                      <a
                        href={`mailto:${item.contactInfo.email}`}
                        className="hover:text-yellow-600"
                      >
                        {item.contactInfo.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Additional Notes
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Sharer
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
