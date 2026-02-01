"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, requiredUserType = null }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(
          "/login?redirect=" + encodeURIComponent(window.location.pathname),
        );
      } else if (
        requiredUserType &&
        user?.prefs?.userType !== requiredUserType
      ) {
        // Redirect if user type doesn't match
        router.push("/");
      }
    }
  }, [loading, isAuthenticated, user, requiredUserType, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredUserType && user?.prefs?.userType !== requiredUserType) {
    return null;
  }

  return children;
}
