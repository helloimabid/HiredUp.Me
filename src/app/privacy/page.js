import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - hiredup.me",
  description:
    "Privacy policy for hiredup.me - how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-600 mb-4">
                Welcome to hiredup.me. We are committed to protecting your
                personal information and your right to privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-slate-600 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Account information (name, email, password)</li>
                <li>Profile information (resume, skills, work history)</li>
                <li>Job application data</li>
                <li>Communications with us</li>
                <li>Payment information (for employers)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-slate-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Match job seekers with relevant opportunities</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Information Sharing
              </h2>
              <p className="text-slate-600 mb-4">
                We may share your information with employers when you apply for
                jobs, service providers who assist our operations, and as
                required by law. We do not sell your personal information to
                third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information. However, no method of
                transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Contact Us
              </h2>
              <p className="text-slate-600">
                If you have questions about this Privacy Policy, please contact
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
