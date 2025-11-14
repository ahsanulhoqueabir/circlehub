"use client";

import { Calendar, MapPin, User } from "lucide-react";
import Image from "next/image";
import { ShareItem } from "@/lib/mock-data/share-items";

interface ItemCardProps {
  item: ShareItem;
  onClick: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
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

export default function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] h-fit break-inside-avoid mb-4"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={item.images[0] || "/placeholder-image.jpg"}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(
              item.condition
            )}`}
          >
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {item.category}
          </span>
          {item.isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Available
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{item.contactInfo.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Posted {formatDate(item.datePosted)}</span>
          </div>
        </div>

        {/* Availability */}
        {item.availability && (
          <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-md">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Availability:</strong> {item.availability}
            </p>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
