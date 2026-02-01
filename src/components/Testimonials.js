export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      text: "hiredup.me is a game changer for the Bangladeshi creative industry. I landed a contract with a US startup within a week.",
      name: "Arafat H.",
      role: "UI Designer, Dhaka",
    },
    {
      id: 2,
      text: "Finding reliable developers was always a hassle until we used this platform. The verified profiles save us so much time.",
      name: "Sarah Jenkins",
      role: "HR Director, TechFlow",
    },
    {
      id: 3,
      text: "The payment security and ease of use are unmatched. Finally a platform that feels local but works globally.",
      name: "Tanvir Ahmed",
      role: "Full Stack Dev, Sylhet",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-12 text-center">
          Trusted by freelancers and companies
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <iconify-icon
                    key={i}
                    icon="solar:star-bold"
                    width="16"
                  ></iconify-icon>
                ))}
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </div>
                  <div className="text-xs text-slate-400">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
