import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy - hiredup.me",
  description:
    "Cookie policy for hiredup.me - how we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-slate-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                What Are Cookies?
              </h2>
              <p className="text-slate-600 mb-4">
                Cookies are small text files that are placed on your device when
                you visit a website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Types of Cookies We Use
              </h2>

              <h3 className="text-lg font-medium text-slate-800 mb-2 mt-6">
                Essential Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                These cookies are necessary for the website to function
                properly. They enable core functionality such as security,
                network management, and accessibility.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Analytics Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                We use analytics cookies to understand how visitors interact
                with our website. This helps us improve our services and user
                experience.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Functional Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                These cookies enable enhanced functionality and personalization,
                such as remembering your login status and preferences.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Marketing Cookies
              </h3>
              <p className="text-slate-600 mb-4">
                With your consent, we may use marketing cookies to show you
                relevant advertisements on other websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Managing Cookies
              </h2>
              <p className="text-slate-600 mb-4">
                You can control and manage cookies through your browser
                settings. Please note that removing or blocking cookies may
                impact your user experience and some features may not function
                properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Third-Party Cookies
              </h2>
              <p className="text-slate-600 mb-4">
                We may use third-party services that place cookies on your
                device. These include:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Google Analytics (website analytics)</li>
                <li>Stripe (payment processing)</li>
                <li>Intercom (customer support)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-slate-600 mb-4">
                We may update this Cookie Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Contact Us
              </h2>
              <p className="text-slate-600">
                If you have questions about our use of cookies, please contact
                us at privacy@hiredup.me
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
