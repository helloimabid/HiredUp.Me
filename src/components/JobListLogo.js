"use client";

import { useState } from "react";

// Color palette for company initials
const companyColors = [
  "bg-green-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-orange-600",
  "bg-pink-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-amber-600",
];

function getCompanyColor(company) {
  if (!company) return "bg-slate-400";
  const index = company.charCodeAt(0) % companyColors.length;
  return companyColors[index];
}

export default function JobListLogo({ company, logoUrl }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const initial = (company || "?").charAt(0).toUpperCase();
  const bgColor = getCompanyColor(company);

  // Show fallback if no logo URL or image failed to load
  if (!logoUrl || imageError) {
    return (
      <div
        className={`w-10 h-10 rounded-lg ${bgColor} text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden relative">
      {/* Fallback while loading */}
      {!imageLoaded && (
        <div
          className={`absolute inset-0 ${bgColor} flex items-center justify-center text-white font-bold text-sm`}
        >
          {initial}
        </div>
      )}
      <img
        src={logoUrl}
        alt={`${company} logo`}
        className={`w-full h-full object-contain p-1.5 transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
