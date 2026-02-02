import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Prevent FOIT for better CLS
});

// ============ COMPREHENSIVE SEO METADATA ============
export const metadata = {
  // Basic Meta
  title: {
    default: "HiredUp.me - Find Jobs in Bangladesh & Remote Worldwide",
    template: "%s | HiredUp.me",
  },
  description:
    "Bangladesh's #1 job portal. Find 10,000+ jobs in Dhaka, Chittagong, Sylhet & remote positions worldwide. Connect with top employers. Free job search, career advice & salary insights.",
  keywords: [
    "jobs in Bangladesh",
    "Dhaka jobs",
    "remote jobs",
    "Bangladesh careers",
    "job portal Bangladesh",
    "IT jobs Dhaka",
    "software developer jobs",
    "freelance jobs",
    "work from home Bangladesh",
    "hiring Bangladesh",
    "job search",
    "career opportunities",
    "employment Bangladesh",
    "tech jobs Bangladesh",
    "marketing jobs Dhaka",
  ],
  authors: [{ name: "HiredUp.me", url: "https://hiredup.me" }],
  creator: "HiredUp.me",
  publisher: "HiredUp.me",

  // Favicon & Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",

  // Open Graph for Social Sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hiredup.me",
    siteName: "HiredUp.me",
    title: "HiredUp.me - Find Jobs in Bangladesh & Remote Worldwide",
    description:
      "Bangladesh's leading job portal. Discover thousands of jobs in Dhaka, Chittagong & remote positions. Connect with top employers today!",
    images: [
      {
        url: "https://hiredup.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "HiredUp.me - Get hired up, not just hired",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@haborymesadman",
    creator: "@haborymesadman",
    title: "HiredUp.me - Jobs in Bangladesh & Remote",
    description:
      "Find your dream job in Bangladesh or work remotely worldwide. 10,000+ opportunities waiting for you!",
    images: ["https://hiredup.me/og-image.png"],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your actual verification codes)
  verification: {
    google: "your-google-verification-code", // Add from Google Search Console
    // yandex: "your-yandex-code",
    // bing: "your-bing-code",
  },

  // Alternate Languages (if you add Bangla later)
  alternates: {
    canonical: "https://hiredup.me",
    languages: {
      "en-US": "https://hiredup.me",
      // "bn-BD": "https://hiredup.me/bn",
    },
  },

  // Category
  category: "Jobs & Employment",

  // Additional Meta
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "HiredUp",
    "format-detection": "telephone=no",
    "theme-color": "#4f46e5",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-gray-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 antialiased transition-colors duration-200`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
