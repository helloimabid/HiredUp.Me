"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Template parameters matching your EmailJS template
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
      to_name: "HiredUp Team", // Optional: customize recipient name
    };

    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log("Email sent successfully:", response);
      setSubmitStatus("success");
      
      // Clear form after successful submission
      setName("");
      setEmail("");
      setSubject("general");
      setMessage("");
    } catch (error) {
      console.error("Failed to send email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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
                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <iconify-icon icon="solar:check-circle-bold" width="20"></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">Message sent successfully!</p>
                        <p className="text-sm text-green-700">We&apos;ll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <iconify-icon icon="solar:close-circle-bold" width="20"></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-900">Failed to send message</p>
                        <p className="text-sm text-red-700">Please try again or email us directly.</p>
                      </div>
                    </div>
                  </div>
                )}

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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <iconify-icon icon="svg-spinners:3-dots-fade" width="20"></iconify-icon>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
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