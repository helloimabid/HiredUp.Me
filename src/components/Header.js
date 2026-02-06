"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav w-full">
      <div className="bg-indigo-50/80 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="py-2 text-xs sm:text-sm text-indigo-900/80 dark:text-indigo-100/80 text-center">
            Tired of searching across multiple sites? HiredUp.me brings job
            posts from company sites and other trusted sources into one place.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <Image
              src="/logo.webp"
              alt="hiredup.me"
              width={150}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/jobs"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <iconify-icon
                icon="solar:case-minimalistic-linear"
                width="16"
              ></iconify-icon>
              Jobs
            </Link>
            <Link
              href="/employers"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="/blog"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <span className="hidden lg:inline">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <iconify-icon
                    icon="solar:alt-arrow-down-linear"
                    width="16"
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  ></iconify-icon>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <iconify-icon
                        icon="solar:home-2-linear"
                        width="18"
                      ></iconify-icon>
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <iconify-icon
                        icon="solar:user-linear"
                        width="18"
                      ></iconify-icon>
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard/applications"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <iconify-icon
                        icon="solar:document-text-linear"
                        width="18"
                      ></iconify-icon>
                      My Applications
                    </Link>
                    <Link
                      href="/dashboard/saved-jobs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <iconify-icon
                        icon="solar:bookmark-linear"
                        width="18"
                      ></iconify-icon>
                      Saved Jobs
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                      >
                        <iconify-icon
                          icon="solar:logout-2-linear"
                          width="18"
                        ></iconify-icon>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <iconify-icon
                icon={
                  mobileMenuOpen
                    ? "solar:close-circle-linear"
                    : "solar:hamburger-menu-linear"
                }
                width="24"
                stroke-width="1.5"
              ></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
        >
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
            >
              <iconify-icon
                icon="solar:case-minimalistic-linear"
                width="16"
              ></iconify-icon>
              Jobs
            </Link>
            <Link
              href="/employers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
            >
              For Employers
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
            >
              Blog
            </Link>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-3">
              {loading ? (
                <div className="w-full h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    <iconify-icon
                      icon="solar:home-2-linear"
                      width="18"
                    ></iconify-icon>
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    <iconify-icon
                      icon="solar:user-linear"
                      width="18"
                    ></iconify-icon>
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    <iconify-icon
                      icon="solar:document-text-linear"
                      width="18"
                    ></iconify-icon>
                    My Applications
                  </Link>
                  <Link
                    href="/dashboard/saved-jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    <iconify-icon
                      icon="solar:bookmark-linear"
                      width="18"
                    ></iconify-icon>
                    Saved Jobs
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors py-2 w-full"
                  >
                    <iconify-icon
                      icon="solar:logout-2-linear"
                      width="18"
                    ></iconify-icon>
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-sm font-medium bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
