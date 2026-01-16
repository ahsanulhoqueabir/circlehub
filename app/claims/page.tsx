"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { FoundItemClaimWithProfile } from "@/types/items.types";
import Image from "next/image";
import useAxios from "@/hooks/use-axios";

type ClaimStatus = "pending" | "approved" | "rejected";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const StatusBadge = ({ status }: { status: ClaimStatus }) => {
  const config = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    approved: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Approved",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    rejected: {
      icon: <XCircle className="w-4 h-4" />,
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const { icon, label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

const ClaimCard = ({
  claim,
  type,
  onApprove,
  onReject,
}: {
  claim: FoundItemClaimWithProfile;
  type: "made" | "received";
  onApprove?: (claimId: string) => void;
  onReject?: (claimId: string) => void;
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Item Image */}
        {claim.found_item?.image_url && (
          <div className="w-full sm:w-24 h-24 shrink-0 bg-muted rounded-lg overflow-hidden">
            <Image
              src={claim.found_item.image_url}
              alt={claim.found_item.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Claim Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                {claim.found_item?.title || "Unknown Item"}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">
                    {type === "received"
                      ? claim.claimer_profile?.name || "Unknown"
                      : "You"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(claim.created_at)}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={claim.status} />
          </div>

          {claim.found_item && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[200px]">
                  {claim.found_item.location}
                </span>
              </div>
              <span className="px-2 py-1 bg-muted rounded-md text-xs">
                {claim.found_item.category}
              </span>
            </div>
          )}

          {claim.message && (
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {claim.message}
              </p>
            </div>
          )}

          {/* Contact Info for received claims */}
          {type === "received" && claim.contact_info && (
            <div className="flex flex-wrap gap-3 text-sm mb-3">
              {claim.contact_info.email && (
                <a
                  href={`mailto:${claim.contact_info.email}`}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">
                    {claim.contact_info.email}
                  </span>
                </a>
              )}
              {claim.contact_info.phone && (
                <a
                  href={`tel:${claim.contact_info.phone}`}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>{claim.contact_info.phone}</span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons for received pending claims */}
          {type === "received" &&
            claim.status === "pending" &&
            onApprove &&
            onReject && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => onApprove(claim.id)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(claim.id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ type }: { type: "made" | "received" }) => (
  <div className="text-center py-12 sm:py-16">
    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
      <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">
      No claims {type === "made" ? "made" : "received"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto px-4">
      {type === "made"
        ? "You haven't claimed any found items yet. Browse found items to claim yours!"
        : "No one has claimed your found items yet. Keep checking back!"}
    </p>
  </div>
);

export default function ClaimsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const axios = useAxios();

  const [activeTab, setActiveTab] = useState<"made" | "received">("made");
  const [claimsMade, setClaimsMade] = useState<FoundItemClaimWithProfile[]>([]);
  const [claimsReceived, setClaimsReceived] = useState<
    FoundItemClaimWithProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClaims();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [madeResponse, receivedResponse] = await Promise.all([
        axios.get("/api/claims?type=made"),
        axios.get("/api/claims?type=received"),
      ]);

      setClaimsMade(madeResponse.data.claims || []);
      setClaimsReceived(receivedResponse.data.claims || []);
    } catch (error) {
      console.error("Error fetching claims:", error);
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      setError(
        err?.response?.data?.error || err?.message || "Failed to load claims"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClaim = async (claimId: string) => {
    if (
      !confirm(
        "Are you sure you want to approve this claim? This will mark the item as claimed."
      )
    ) {
      return;
    }

    try {
      await axios.patch(`/api/claims/${claimId}`, {
        status: "approved",
      });

      alert("Claim approved successfully!");
      fetchClaims();
    } catch (error) {
      console.error("Error approving claim:", error);
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      alert(
        err?.response?.data?.error || err?.message || "Failed to approve claim"
      );
    }
  };

  const handleRejectClaim = async (claimId: string) => {
    if (!confirm("Are you sure you want to reject this claim?")) {
      return;
    }

    try {
      await axios.patch(`/api/claims/${claimId}`, {
        status: "rejected",
      });

      alert("Claim rejected");
      fetchClaims();
    } catch (error) {
      console.error("Error rejecting claim:", error);
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      alert(
        err?.response?.data?.error || err?.message || "Failed to reject claim"
      );
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingMade = claimsMade.filter((c) => c.status === "pending").length;
  const pendingReceived = claimsReceived.filter(
    (c) => c.status === "pending"
  ).length;

  const currentClaims = activeTab === "made" ? claimsMade : claimsReceived;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            My Claims
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your item claims and requests
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border mb-6">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("made")}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                activeTab === "made"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Claims Made
                {pendingMade > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold">
                    {pendingMade}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                activeTab === "received"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Claims Received
                {pendingReceived > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold">
                    {pendingReceived}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          {currentClaims.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <div className="space-y-4">
              {currentClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  type={activeTab}
                  onApprove={
                    activeTab === "received" ? handleApproveClaim : undefined
                  }
                  onReject={
                    activeTab === "received" ? handleRejectClaim : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
