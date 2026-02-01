"use client";

export default function ApplyButton({ applyUrl, fullWidth = false }) {
  const handleApply = () => {
    if (applyUrl) {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={!applyUrl}
      className={`flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <iconify-icon
        icon="solar:arrow-right-up-linear"
        width="18"
      ></iconify-icon>
      Apply Now
    </button>
  );
}
