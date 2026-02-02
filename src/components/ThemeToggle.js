"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <iconify-icon
          icon="solar:moon-bold-duotone"
          width="22"
          class="text-slate-600"
        ></iconify-icon>
      ) : (
        <iconify-icon
          icon="solar:sun-bold-duotone"
          width="22"
          class="text-yellow-400"
        ></iconify-icon>
      )}
    </button>
  );
}
