import Link from "next/link";

type Project = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  tags: string[];
  icon: string;
  cta: string;
};

const projects: Project[] = [
  {
    title: "CDC Vouchers — Exact Amount Payment UX",
    subtitle: "Product / UX Case Study",
    description:
      "An opt-in exact-amount mode for digitally confident users who want to fully utilise CDC vouchers — while preserving default flows for elderly users and merchants.",
    href: "/projects/cdc",
    tags: ["Product Thinking", "UX Flow", "Edge Cases", "Constraints"],
    icon: "🧾",
    cta: "View case study",
  },
  {
    title: "CMB Dating App Concept",
    subtitle: "Product Concept / UX",
    description:
      "A concept exploration around matching, messaging, and trust signals — focused on improving clarity and reducing friction in key steps.",
    href: "/projects/cmb",
    tags: ["Product Spec", "UX", "Experiment Ideas"],
    icon: "💬",
    cta: "View project",
  },
  {
    title: "SMU App Project",
    subtitle: "Campus Product / Systems",
    description:
      "A campus-focused product build where I worked through scope, user flow, and prioritisation — translating messy constraints into a shippable plan.",
    href: "/projects/smu",
    tags: ["Scope", "User Flow", "Prioritisation"],
    icon: "🏫",
    cta: "View project",
  },
];

export default function Home() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="px-6 sm:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
            <span>🇸🇬</span>
            <span>Portfolio</span>
            <span className="text-gray-300">•</span>
            <span>Min Xie Ng</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Min Xie Ng
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-7 sm:leading-8">
            Information Systems student with a strong interest in product and
            user experience — I like turning real-world constraints into clean,
            usable solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <a
              href="https://www.linkedin.com/in/min-xie-ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              LinkedIn
              <span className="ml-2">↗</span>
            </a>

            <a
              href="mailto:minxie0000@gmail.com"
              className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
            >
              Email me
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Divider */}
          <div className="pt-6">
            <div className="h-px w-full bg-gray-200" />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-6 sm:px-8 py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Selected Projects
              </h2>
              <p className="mt-3 text-gray-600 max-w-2xl leading-7">
                Visual, scrollable case studies — focused on product decisions,
                user flows, and practical constraints.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="
                  group relative rounded-xl border bg-white p-6
                  transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                "
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.icon}</span>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {p.subtitle}
                      </p>
                    </div>

                    <h3 className="mt-2 text-lg sm:text-xl font-semibold leading-snug">
                      {p.title}
                    </h3>
                  </div>

                  <span
                    className="
                      shrink-0 inline-flex items-center justify-center
                      rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-600
                      group-hover:bg-white transition
                    "
                  >
                    {p.cta}
                    <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-6">
                  {p.description}
                </p>

                {/* tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="
                        rounded-full border bg-white px-3 py-1
                        text-xs text-gray-600
                        transition
                        group-hover:border-gray-300
                      "
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* subtle bottom divider */}
                <div className="mt-6 h-px w-full bg-gray-100 group-hover:bg-gray-200 transition" />
              </Link>
            ))}
          </div>

          {/* Small note */}
          <div className="mt-10">
            <p className="text-sm text-gray-500 leading-6">
              Portfolio in progress — more projects coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-6 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Let’s chat</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-6">
              If you’re hiring for product / UX / ops roles, I’m happy to share
              more context or walk through my thinking.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:minxie0000@gmail.com"
                className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Email
                <span className="ml-2">→</span>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
              >
                LinkedIn
                <span className="ml-2">↗</span>
              </a>
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Min Xie Ng
          </p>
        </div>
      </section>
    </main>
  );
}