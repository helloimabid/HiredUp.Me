"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, loginWithLinkedIn, isAuthenticated } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const redirect = searchParams.get("redirect") || "/";
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);

  useEffect(() => {
    if (errorParam === "oauth_failed") {
      setError("OAuth sign in failed. Please try again.");
    } else if (errorParam === "callback_failed") {
      setError("Authentication callback failed. Please try again.");
    }

    if (messageParam === "password_reset") {
      setMessage("Password reset successfully. You can now sign in.");
    }
  }, [errorParam, messageParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
          <iconify-icon
            icon="solar:arrow-right-up-linear"
            width="24"
          ></iconify-icon>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Sign in to your hiredup.me account
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded border-slate-300 dark:border-slate-600"
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={loginWithGoogle}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <iconify-icon icon="logos:google-icon" width="18"></iconify-icon>
            Google
          </button>
          <button
            onClick={loginWithLinkedIn}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <iconify-icon icon="logos:linkedin-icon" width="18"></iconify-icon>
            LinkedIn
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
