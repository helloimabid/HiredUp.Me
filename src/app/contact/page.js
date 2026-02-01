"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log({ name, email, subject, message });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                Get in Touch
              </h1>
              <p className="text-slate-500 mb-8">
                Have a question or feedback? We&apos;d love to hear from you.
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:pt-16">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <iconify-icon
                          icon="solar:letter-linear"
                          width="20"
                        ></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="text-slate-900">support@hiredup.me</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <iconify-icon
                          icon="solar:phone-linear"
                          width="20"
                        ></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="text-slate-900">+880 1XXX-XXXXXX</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <iconify-icon
                          icon="solar:map-point-linear"
                          width="20"
                        ></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="text-slate-900">Dhaka, Bangladesh</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Follow Us
                  </h2>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                    >
                      <iconify-icon
                        icon="ri:facebook-fill"
                        width="20"
                      ></iconify-icon>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                    >
                      <iconify-icon
                        icon="ri:twitter-x-fill"
                        width="20"
                      ></iconify-icon>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                    >
                      <iconify-icon
                        icon="ri:linkedin-fill"
                        width="20"
                      ></iconify-icon>
                    </a>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6">
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Looking for support?
                  </h3>
                  <p className="text-sm text-indigo-700 mb-4">
                    Check out our help center for quick answers to common
                    questions.
                  </p>
                  <a
                    href="/resources"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Visit Help Center
                    <iconify-icon
                      icon="solar:arrow-right-linear"
                      width="16"
                    ></iconify-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
