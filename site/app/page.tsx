export default function Home() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="min-h-screen px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            Min Xie Ng
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Information Systems student with a strong interest in product and user
            experience, focused on solving real-world problems through thoughtful,
            user-centred solutions.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold">Projects</h2>

          <div className="mt-8 space-y-6">
            {/* CDC PROJECT CARD */}
            <a
              href="/projects/cdc"
              className="block border rounded-lg p-6 bg-white hover:shadow-md transition"
            >
              <h3 className="font-medium">
                CDC Vouchers — Exact Amount Payment UX
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Enabling optional exact-amount payments for digitally confident users,
                while preserving default flows for elderly users and merchants.
              </p>
              <p className="mt-3 text-sm font-medium text-blue-600">
                View case study →
              </p>
            </a>

            {/* SMU APP PROJECT CARD (placeholder) */}
            <div className="border rounded-lg p-6 bg-white opacity-60">
              <h3 className="font-medium">
                SMU App — Food Pre-Order Feature
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Reducing campus food queue times through pre-ordering.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Case study coming soon
              </p>
            </div>

            {/* CMB PROJECT CARD (placeholder) */}
            <div className="border rounded-lg p-6 bg-white opacity-60">
              <h3 className="font-medium">
                CMB Dating App — Product Concept
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Exploring transparency and intent in dating app matching.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Case study coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-4 text-gray-600">
            Feel free to reach out via LinkedIn or email.
          </p>

          <div className="mt-4 space-x-4">
            <a
              href="https://www.linkedin.com/"
              className="text-blue-600 underline"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              href="mailto:your@email.com"
              className="text-blue-600 underline"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}