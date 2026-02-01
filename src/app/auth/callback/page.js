"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { checkUser } = useAuth();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Refresh the user state after OAuth callback
        await checkUser();
        setStatus("Success! Redirecting...");

        // Redirect to dashboard or home after successful auth
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => {
          router.push("/login?error=callback_failed");
        }, 2000);
      }
    }

    handleCallback();
  }, [checkUser, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">{status}</h1>
        <p className="text-slate-500 text-sm">
          Please wait while we complete your sign in...
        </p>
      </div>
    </main>
  );
}
