"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function DashboardContent() {
  const { user } = useAuth();
  const userType = user?.prefs?.userType || "jobseeker";

  const jobSeekerStats = [
    {
      label: "Applications Sent",
      value: "0",
      icon: "solar:document-text-linear",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Profile Views",
      value: "0",
      icon: "solar:eye-linear",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Saved Jobs",
      value: "0",
      icon: "solar:bookmark-linear",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Interviews",
      value: "0",
      icon: "solar:calendar-linear",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const employerStats = [
    {
      label: "Active Jobs",
      value: "0",
      icon: "solar:case-linear",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Applications",
      value: "0",
      icon: "solar:document-text-linear",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Candidates Viewed",
      value: "0",
      icon: "solar:users-group-two-rounded-linear",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Interviews Scheduled",
      value: "0",
      icon: "solar:calendar-linear",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const stats = userType === "employer" ? employerStats : jobSeekerStats;

  const quickActions =
    userType === "employer"
      ? [
          {
            label: "Post a Job",
            href: "/post-job",
            icon: "solar:add-circle-linear",
            color: "bg-indigo-600 text-white",
          },
          {
            label: "Search Talent",
            href: "/talent-search",
            icon: "solar:magnifer-linear",
            color: "bg-slate-100 text-slate-700",
          },
          {
            label: "View Applications",
            href: "/dashboard/applications",
            icon: "solar:document-text-linear",
            color: "bg-slate-100 text-slate-700",
          },
        ]
      : [
          {
            label: "Browse Jobs",
            href: "/jobs",
            icon: "solar:magnifer-linear",
            color: "bg-indigo-600 text-white",
          },
          {
            label: "Update Profile",
            href: "/dashboard/profile",
            icon: "solar:user-linear",
            color: "bg-slate-100 text-slate-700",
          },
          {
            label: "Saved Jobs",
            href: "/dashboard/saved-jobs",
            icon: "solar:bookmark-linear",
            color: "bg-slate-100 text-slate-700",
          },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {userType === "employer"
            ? "Manage your job postings and find great talent."
            : "Track your applications and find your next opportunity."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <div
              className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}
            >
              <iconify-icon icon={stat.icon} width="20"></iconify-icon>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${action.color} hover:opacity-90`}
            >
              <iconify-icon icon={action.icon} width="18"></iconify-icon>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <iconify-icon
                icon="solar:clock-circle-linear"
                class="text-slate-400 text-2xl"
              ></iconify-icon>
            </div>
            <p className="text-slate-500 text-sm">No recent activity</p>
            <p className="text-slate-400 text-xs mt-1">
              {userType === "employer"
                ? "Post a job to get started"
                : "Start applying to jobs to see your activity here"}
            </p>
          </div>
        </div>

        {/* Profile Completion / Job Recommendations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {userType === "employer" ? "Company Profile" : "Profile Completion"}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Profile strength</span>
                <span className="text-slate-900 font-medium">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Complete your profile to:
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li className="flex items-center gap-2">
                  <iconify-icon
                    icon="solar:check-circle-linear"
                    class="text-green-500"
                  ></iconify-icon>
                  Basic information added
                </li>
                <li className="flex items-center gap-2">
                  <iconify-icon
                    icon="solar:close-circle-linear"
                    class="text-slate-300"
                  ></iconify-icon>
                  Add profile picture
                </li>
                <li className="flex items-center gap-2">
                  <iconify-icon
                    icon="solar:close-circle-linear"
                    class="text-slate-300"
                  ></iconify-icon>
                  {userType === "employer"
                    ? "Add company description"
                    : "Upload resume"}
                </li>
                <li className="flex items-center gap-2">
                  <iconify-icon
                    icon="solar:close-circle-linear"
                    class="text-slate-300"
                  ></iconify-icon>
                  {userType === "employer" ? "Verify company" : "Add skills"}
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Complete profile
              <iconify-icon
                icon="solar:arrow-right-linear"
                width="16"
              ></iconify-icon>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <DashboardContent />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
