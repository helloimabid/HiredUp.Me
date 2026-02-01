import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service - hiredup.me",
  description: "Terms of service for using hiredup.me platform.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 mb-4">
                By accessing or using hiredup.me, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-600 mb-4">
                hiredup.me is an online platform that connects job seekers with
                employers. We provide tools for job posting, candidate search,
                and application management.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. User Accounts
              </h2>
              <p className="text-slate-600 mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials. You agree to provide accurate and complete
                information during registration and to update your information
                as needed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. User Conduct
              </h2>
              <p className="text-slate-600 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Post false or misleading information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Use the platform for unauthorized commercial purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass or discriminate against other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Job Postings
              </h2>
              <p className="text-slate-600 mb-4">
                Employers are responsible for ensuring their job postings comply
                with all applicable employment laws and do not contain
                discriminatory requirements. We reserve the right to remove any
                posting that violates our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Payment Terms
              </h2>
              <p className="text-slate-600 mb-4">
                Paid services are billed according to the pricing plan selected.
                Refunds are available within 14 days of purchase if no job
                postings have been made.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-slate-600 mb-4">
                All content on hiredup.me, including logos, text, and graphics,
                is owned by us or our licensors. You may not use our
                intellectual property without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-slate-600 mb-4">
                hiredup.me is provided &quot;as is&quot; without warranties of
                any kind. We are not liable for any indirect, incidental, or
                consequential damages arising from your use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-slate-600 mb-4">
                We may update these terms from time to time. We will notify you
                of significant changes via email or through the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Contact
              </h2>
              <p className="text-slate-600">
                For questions about these Terms of Service, contact us at
                legal@hiredup.me
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
