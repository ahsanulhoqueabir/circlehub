"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Eye,
  User,
  Tag,
  MessageCircle,
  Share2,
  Phone,
  Mail,
} from "lucide-react";
import { FoundItem } from "@/lib/mock-data/found-items";
import Image from "next/image";

// Simple date formatting function
const formatDateDistance = (date: string) => {
  const now = new Date();
  const foundDate = new Date(date);
  const diffInMs = now.getTime() - foundDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1 day";
  if (diffInDays < 30) return `${diffInDays} days`;
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? "1 year" : `${years} years`;
};

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface ItemDetailModalProps {
  item: FoundItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: FoundItem["status"] }) => {
  const statusConfig = {
    available: {
      label: "Available",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      description: "This item is still available for the owner to claim",
    },
    claimed: {
      label: "Claimed",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      description: "This item has been successfully claimed by its owner",
    },
    returned: {
      label: "Returned",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      description: "This item has been successfully returned to its owner",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="text-center">
      <span
        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${config.className} mb-2`}
      >
        {config.label}
      </span>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {config.description}
      </p>
    </div>
  );
};

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
}: ItemDetailModalProps) {
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (!isOpen || !item) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Found Item: ${item.title}`,
          text: `I found this item: ${item.title}. Location: ${item.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  const parseContactInfo = (contactInfo: string) => {
    const emailMatch = contactInfo.match(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    );
    const phoneMatch = contactInfo.match(
      /(\+?880-?\d{4}-?\d{6}|\+?880\d{10}|01\d{9})/
    );

    return {
      email: emailMatch ? emailMatch[1] : null,
      phone: phoneMatch ? phoneMatch[1] : null,
      raw: contactInfo,
    };
  };

  const contact = parseContactInfo(item.contactInfo);

  return (
    <div
      className="fixed inset-0 backdrop-blur-lg bg-black/20 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {item.title}
            </h2>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Found {formatDateDistance(item.dateFound)} ago</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{item.views || 0} views</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleShare}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Share this found item"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Image and Status */}
            <div className="lg:col-span-1">
              {item.imageUrl && (
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700 rounded-lg mb-6">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <StatusBadge status={item.status} />
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Tag className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Category</span>
                      <p className="text-slate-900 dark:text-white">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Found at</span>
                      <p className="text-slate-900 dark:text-white">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Date found</span>
                      <p className="text-slate-900 dark:text-white">
                        {formatFullDate(item.dateFound)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Found by</span>
                      <p className="text-slate-900 dark:text-white">
                        {item.foundBy.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {item.status === "available" && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Contact Finder
                  </h3>
                  {!showContactInfo ? (
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Is this your item? Contact the finder to claim it.
                      </p>
                      <button
                        onClick={() => setShowContactInfo(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Show Contact Information
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {!contact.email && !contact.phone && (
                        <p className="text-slate-700 dark:text-slate-300">
                          {contact.raw}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Please be prepared to describe the item in detail to
                        verify ownership.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {item.status === "claimed" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Item Claimed
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This item has been successfully returned to its owner.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
