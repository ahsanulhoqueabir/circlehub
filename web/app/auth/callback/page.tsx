"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auth callback page
 * This page is no longer needed as the app uses JWT authentication
 * Redirecting to login page
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login since this callback is no longer used
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
