export default function CDCProject() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            CDC Vouchers — Exact Amount Payment UX
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            A product case study on enabling optional flexibility for digitally
            confident users who want to fully utilise CDC vouchers, while
            preserving default experiences for elderly users and merchants.
          </p>
        </div>
      </section>

      {/* WHO IT'S FOR / NOT FOR */}
      <section className="px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-medium">Who this is for</h3>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Digitally confident users</li>
              <li>Users frustrated by being unable to pay exact amounts</li>
              <li>Users who want greater control over voucher usage</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-medium">Who this is not for</h3>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Elderly users who prefer the existing voucher flow</li>
              <li>Users uncomfortable with numeric input</li>
              <li>Merchants — their workflow remains unchanged</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROTOTYPE / VISUAL SECTION */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">
            Prototype & Flow
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl">
            The solution introduces an optional exact-amount mode layered on top
            of the existing CDC voucher system, without disrupting default
            behaviour.
          </p>

          {/* FIGMA PROTOTYPE EMBED */}
          <div className="mt-8">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-white">
              <iframe
                className="w-full h-full"
                src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/YnuunkMx8t8J073brR1atf/CDC-Project?node-id=0-1&t=pLBdbvhNsgIxR5ej-1"
                allowFullScreen
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              You can interact with the prototype directly here, or{" "}
              <a
                href="https://www.figma.com/proto/YnuunkMx8t8J073brR1atf/CDC-Project?node-id=0-1&t=pLBdbvhNsgIxR5ej-1"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                open it in Figma
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* KEY INSIGHTS */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">
            Key Product Decisions
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">Defaults over features</h3>
              <p className="mt-2 text-sm text-gray-600">
                Exact-amount mode is optional, ensuring existing users are not
                forced into new behaviour.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">Merchant flow preserved</h3>
              <p className="mt-2 text-sm text-gray-600">
                No additional steps are introduced for merchants during payment.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">Constraints as design inputs</h3>
              <p className="mt-2 text-sm text-gray-600">
                Policy and inclusivity constraints shaped the solution rather
                than being worked around.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-medium">Edge cases build trust</h3>
              <p className="mt-2 text-sm text-gray-600">
                Fractional balances and voucher exhaustion were handled
                deliberately to avoid confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REFLECTION */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">
            Reflection
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl">
            This project shifted my thinking from feature-driven design to
            behaviour-driven product decisions grounded in real-world
            constraints and user segmentation.
          </p>

          {/* SINGLE DEEP-DIVE CTA */}
          <a
            href="https://docs.google.com/document/d/1_oH6ieT1ukCux1Q3q5WWJP1jf0w3Ius0P9GMfqRnxVg/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-sm font-medium text-blue-600 underline"
          >
            Read the full CDC case study documentation →
          </a>
        </div>
      </section>
    </main>
  );
}