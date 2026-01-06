"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const TOKEN_KEY = "campus_connect_token";
const USER_KEY = "campus_connect_user";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          router.push("/login?error=auth_error");
          return;
        }

        if (data.session && data.session.user) {
          // Get user data and generate JWT token via API
          const response = await fetch("/api/auth/google/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.session.user.id,
              email: data.session.user.email,
            }),
          });

          if (response.ok) {
            const result = await response.json();

            if (result.user && result.token) {
              // Save to localStorage
              localStorage.setItem(TOKEN_KEY, result.token);
              localStorage.setItem(USER_KEY, JSON.stringify(result.user));

              // Redirect to home
              router.push("/");
              return;
            }
          }

          // Fallback: redirect to home even if token generation fails
          router.push("/");
        } else {
          // No session, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/login?error=callback_error");
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
