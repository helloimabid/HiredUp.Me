"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SaveJobButton({ job }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.$id,
          jobId: job.$id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          apply_url: job.apply_url,
        }),
      });

      if (response.ok) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <iconify-icon icon="solar:bookmark-linear" width="18"></iconify-icon>
        Save
      </Link>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
        saved
          ? "border-green-200 bg-green-50 text-green-600"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      <iconify-icon
        icon={saved ? "solar:bookmark-bold" : "solar:bookmark-linear"}
        width="18"
      ></iconify-icon>
      {loading ? "Saving..." : saved ? "Saved" : "Save"}
    </button>
  );
}
