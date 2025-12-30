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
            Information Systems student with a strong interest in product and user experience,
            focused on solving real-world problems through thoughtful, user-centred solutions.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold">Projects</h2>

          <div className="mt-8 space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">CDC Vouchers UX</h3>
              <p className="mt-2 text-sm text-gray-600">
                Improving exact-amount payments for elderly users through better interaction design.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">SMU App – Food Pre-Order</h3>
              <p className="mt-2 text-sm text-gray-600">
                A campus feature to reduce queue time by allowing students to pre-order meals.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">CMB Dating App Concept</h3>
              <p className="mt-2 text-sm text-gray-600">
                A product concept exploring better matching transparency and user intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold">About</h2>
          <p className="mt-4 text-gray-600">
            I enjoy working at the intersection of users, business, and technology.
            I’m especially interested in product roles where clear thinking and communication matter.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-8 py-20 bg-gray-50">
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