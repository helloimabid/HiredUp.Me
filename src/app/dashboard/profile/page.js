"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { updateUserPrefs, updateUserName } from "@/lib/appwrite-client";

function ProfileContent() {
  const { user, checkUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.prefs?.phone || "");
  const [location, setLocation] = useState(user?.prefs?.location || "");
  const [bio, setBio] = useState(user?.prefs?.bio || "");
  const [skills, setSkills] = useState(user?.prefs?.skills || "");
  const [experience, setExperience] = useState(user?.prefs?.experience || "");
  const [education, setEducation] = useState(user?.prefs?.education || "");
  const [linkedin, setLinkedin] = useState(user?.prefs?.linkedin || "");
  const [portfolio, setPortfolio] = useState(user?.prefs?.portfolio || "");
  const [github, setGithub] = useState(user?.prefs?.github || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Update name if changed
      if (name !== user?.name && name.trim()) {
        await updateUserName(name);
      }

      // Update preferences
      await updateUserPrefs({
        ...user?.prefs,
        phone,
        location,
        bio,
        skills,
        experience,
        education,
        linkedin,
        portfolio,
        github,
      });

      await checkUser();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: "solar:user-linear" },
    { id: "experience", name: "Experience", icon: "solar:case-linear" },
    { id: "links", name: "Links", icon: "solar:link-linear" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal information and settings.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <iconify-icon icon={tab.icon} width="18"></iconify-icon>
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
            <iconify-icon
              icon="solar:check-circle-linear"
              width="20"
            ></iconify-icon>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
            <iconify-icon
              icon="solar:danger-triangle-linear"
              width="20"
            ></iconify-icon>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Member since{" "}
                    {new Date(user?.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your career goals, and what makes you unique..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="JavaScript, React, Node.js, Python, Data Analysis..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Separate skills with commas
                </p>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Experience
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your work experience, previous roles, and achievements...

Example:
- Software Engineer at ABC Company (2022-Present)
  Built and maintained web applications using React and Node.js
  
- Junior Developer at XYZ Inc (2020-2022)
  Developed features for mobile applications"
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Education
                </label>
                <textarea
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Your educational background...

Example:
- BSc in Computer Science, University of Dhaka (2020)
- HSC, Dhaka College (2016)"
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Links Tab */}
          {activeTab === "links" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500 mb-4">
                Add your professional links to help employers find and connect
                with you.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-2">
                    <iconify-icon
                      icon="mdi:linkedin"
                      width="18"
                      class="text-blue-600"
                    ></iconify-icon>
                    LinkedIn
                  </span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-2">
                    <iconify-icon icon="mdi:github" width="18"></iconify-icon>
                    GitHub
                  </span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-2">
                    <iconify-icon
                      icon="solar:global-linear"
                      width="18"
                      class="text-indigo-600"
                    ></iconify-icon>
                    Portfolio / Website
                  </span>
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <iconify-icon
                    icon="solar:diskette-linear"
                    width="18"
                  ></iconify-icon>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <ProfileContent />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
