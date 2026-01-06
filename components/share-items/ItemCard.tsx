"use client";

import { Calendar, MapPin, User, DollarSign } from "lucide-react";
import Image from "next/image";
import { ShareItemWithProfile } from "@/types/items.types";

interface ItemCardProps {
  item: ShareItemWithProfile;
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

const getOfferTypeColor = (offerType: string) => {
  switch (offerType) {
    case "free":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "exchange":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "rent":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "sale":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
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
          src={item.image_url || "/placeholder-image.jpg"}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOfferTypeColor(
              item.offer_type
            )}`}
          >
            {item.offer_type.charAt(0).toUpperCase() + item.offer_type.slice(1)}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(
              item.condition
            )}`}
          >
            {item.condition
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
          {item.status === "active" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Available
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Price (if sale) */}
        {item.offer_type === "sale" && item.price && (
          <div className="flex items-center gap-1 mb-2 text-yellow-600 dark:text-yellow-400 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>৳{item.price}</span>
          </div>
        )}

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
            <span>{item.profiles?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Posted {formatDate(item.created_at)}</span>
          </div>
        </div>

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
