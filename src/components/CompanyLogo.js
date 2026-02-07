"use client";

import { useState } from "react";

// Logo.dev publishable key (safe for client-side use)
const LOGO_DEV_KEY = "pk_XCMtoIJ7RMy7XgG2Ruf6UA";

// Helper: Get company logo color based on first letter
function getCompanyLogoColor(company) {
  const colors = [
    "bg-green-600 shadow-green-600/20",
    "bg-blue-600 shadow-blue-600/20",
    "bg-purple-600 shadow-purple-600/20",
    "bg-orange-600 shadow-orange-600/20",
    "bg-pink-600 shadow-pink-600/20",
    "bg-teal-600 shadow-teal-600/20",
    "bg-indigo-600 shadow-indigo-600/20",
  ];
  const index = (company || "A").charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Generate a Logo.dev URL from a company name.
 */
function getLogoDev(company) {
  if (!company) return null;
  const clean = company
  if (!clean || clean.length < 2) return null;
  return `https://img.logo.dev/name/${clean}?token=${LOGO_DEV_KEY}&size=128`;
}

export default function CompanyLogo({
  company,
  logoUrl,
  size = "md",
  className = "",
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10 text-base",
    md: "w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl",
    lg: "w-24 h-24 text-4xl",
  };

  const logoColor = getCompanyLogoColor(company);
  const initial = (company || "?").charAt(0).toUpperCase();
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Determine the logo URL: explicit > Logo.dev auto-generated
  const effectiveLogoUrl = logoUrl || getLogoDev(company);

  // If no logo URL or image errored, show fallback
  if (!effectiveLogoUrl || imageError) {
    return (
      <div
        className={`${sizeClass} ${logoColor} rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ${className}`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Show fallback while loading */}
      {!imageLoaded && (
        <div
          className={`absolute inset-0 ${logoColor} flex items-center justify-center text-white font-bold`}
        >
          {initial}
        </div>
      )}
      <img
        src={effectiveLogoUrl}
        alt={`${company} logo`}
        className={`w-full h-full object-contain transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
