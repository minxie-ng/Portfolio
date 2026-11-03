import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TrustKaki — Min Xie",
  description: "An AI Lodge hackathon-winning prototype for senior check-ins and care coordination.",
};

const sections = [
  ["top", "Overview"], ["problem", "Problem"], ["demo", "Demo"],
  ["workflow", "Workflow"], ["decisions", "Decisions"], ["reflection", "Reflection"],
];
const button = "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe7bf]";
const chapter = "scroll-mt-24 border-b border-white/10 py-16 sm:py-20";

const walkthrough = [
  {
    title: "01 · Start with a familiar conversation",
    text: "Seniors share everyday updates through messaging. A check-in about breakfast or knee comfort can reveal useful context without asking someone to learn a care dashboard.",
    image: "telegram-conversation.png", width: 1364, height: 500,
    alt: "A fictional senior tells the TrustKaki Telegram bot that breakfast is eaten and knee discomfort has improved.",
    caption: "A fictional Telegram exchange: an everyday update becomes context for the care team.",
  },
  {
    title: "02 · Connect small changes across days",
    text: "Knee discomfort, a skipped breakfast, fewer downstairs trips and a missed check-in can look minor in isolation. Pattern Watch connects saved observations across days so staff can review the evidence together.",
    image: "four-day-pattern.png", width: 804, height: 708,
    alt: "Four-day fictional timeline showing knee pain, skipped breakfast, reduced movement and a missed check-in.",
    caption: "Prepared fictional history demonstrates the pattern; it does not establish a diagnosis.",
  },
  {
    title: "03 · Make the next human action clear",
    text: "The care workspace brings together who needs attention, what changed and a suggested follow-up. Relevant personal context sits beside the case, helping staff plan a more informed conversation.",
    image: "care-workspace.png", width: 3420, height: 1896,
    alt: "TrustKaki care workspace with a senior priority list, supporting context and a recommended staff follow-up.",
    caption: "Priority, evidence and the next action in one view. Staff retain responsibility for care decisions.",
  },
  {
    title: "04 · Make AI decisions inspectable",
    text: "The judge workspace exposes the message interpretation, specialist reviews, final policy and save outcomes. In this example, a payment concern receives a digital-safety review and a precautionary reply.",
    image: "jev-safety-routing.png", width: 3420, height: 1892,
    alt: "Judge workspace showing a fictional payment concern, Triage output and a Digital Safety Agent review.",
    caption: "An observed demo run, with the application’s final policy shown separately from model recommendations.",
  },
  {
    title: "05 · Remember the person behind the message",
    text: "Personal-memory retrieval brings relevant preferences into the conversation. Here, the reply uses saved preferences for quiet one-to-one check-ins and practical meal support, with the retrieved evidence visible beside it.",
    image: "rag-personalisation.png", width: 3420, height: 1894,
    alt: "A personalised reply beside retrieved preferences, their source and confirmation dates.",
    caption: "This example shows retrieval of existing memories; reading memory and saving new facts are separate steps.",
  },
];

export default function TrustKakiProject() {
  return (
    <main className="min-h-screen bg-[#061820] text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-white/[0.06] to-transparent" aria-hidden />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061820]/85 backdrop-blur">
        <nav aria-label="TrustKaki case study" className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 sm:px-8">
          <Link href="/" className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-sm text-[#9fe7bf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe7bf]">← Home</Link>
          <div className="flex min-w-0 gap-1 overflow-x-auto">
            {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-3 py-1 text-sm text-white/65 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe7bf]">{label}</a>)}
          </div>
        </nav>
      </header>
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <section id="top" className={chapter}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fe7bf]">AI Lodge Hackathon Winner · October 2026</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">TrustKaki — small check-ins, clearer care.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">An AI-assisted check-in and care-coordination system for Active Ageing Centres. Everyday conversations help staff spot changes over time and decide whom to follow up with.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className={`${button} bg-white text-[#061820] hover:bg-white/90`}>Watch the demo ↓</a>
            <a href="https://trustkaki.vercel.app" target="_blank" rel="noopener noreferrer" className={button}>Try TrustKaki ↗</a>
            <a href="https://github.com/minxie-ng/trustkaki" target="_blank" rel="noopener noreferrer" className={button}>View code ↗</a>
          </div>
          <div className="mt-12 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3">
            {[
              ["Problem", "Care context is scattered across conversations, making gradual changes easy to miss."],
              ["Approach", "Connect check-ins, personal memory and evidence-backed follow-ups in one care workflow."],
              ["Result", "AI Lodge hackathon winner. A working prototype demonstrated with fictional senior records."],
            ].map(([title, text]) => <div key={title}><h2 className="text-sm font-semibold text-[#9fe7bf]">{title}</h2><p className="mt-3 text-sm leading-6 text-white/65">{text}</p></div>)}
          </div>
        </section>
        <section id="problem" className={chapter}>
          <h2 className="text-2xl font-semibold sm:text-3xl">The problem: the signals are there, but scattered.</h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">An update about knee pain, a skipped meal and declining a usual activity may arrive on different days. Care staff need a way to connect those observations, preserve personal context between handovers and make follow-up ownership clear.</p>
          <p className="mt-4 max-w-3xl leading-8 text-white/70">TrustKaki focuses on the staff decision: who needs attention, why now, and what should happen next? Seniors keep using familiar messaging, while the care team gets a focused workspace.</p>
        </section>
        <section id="demo" className={chapter}>
          <h2 className="text-2xl font-semibold sm:text-3xl">See the care loop in action</h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/65">A short product walkthrough: Telegram conversation → care workspace → decision trail → personal memory.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <video controls playsInline preload="metadata" poster="/projects/trustkaki/care-workspace.png" className="aspect-video w-full">
              <source src="/projects/trustkaki/demo.mp4" type="video/mp4" />
              Your browser does not support video. <a href="/projects/trustkaki/demo.mp4">Open the demo video.</a>
            </video>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/45">English narration and captions are included in the video. All senior profiles, conversations and care records shown are fictional demo data.</p>
        </section>
        <section id="workflow" className={chapter}>
          <h2 className="text-2xl font-semibold sm:text-3xl">From a message to an informed follow-up</h2>
          <div className="mt-12 space-y-16">
            {walkthrough.map((step) => <article key={step.image}>
              <h3 className="text-xl font-semibold text-[#9fe7bf]">{step.title}</h3>
              <p className="mt-4 max-w-3xl leading-7 text-white/65">{step.text}</p>
              <figure className="mt-6">
                <a href={`/projects/trustkaki/${step.image}`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${step.title}`} className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe7bf]">
                  <Image src={`/projects/trustkaki/${step.image}`} alt={step.alt} width={step.width} height={step.height} sizes="(max-width: 1152px) 100vw, 1088px" className="mx-auto h-auto max-h-[42rem] w-auto max-w-full rounded-xl" />
                </a>
                <figcaption className="mt-3 text-sm leading-6 text-white/45">{step.caption} Click the image for a closer look.</figcaption>
              </figure>
            </article>)}
          </div>
        </section>
        <section id="decisions" className={chapter}>
          <h2 className="text-2xl font-semibold sm:text-3xl">The product decisions behind the workflow</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              ["Keep human follow-up central", "AI surfaces evidence and suggests action; care staff review the situation and retain the decision."],
              ["Separate memory from patterns", "RAG recalls relevant personal facts. Pattern Watch connects structured observations across distinct days."],
              ["Show the evidence", "Source context, retrieved memories and decision outcomes make the system easier to inspect and question."],
              ["Keep the care desk focused", "Staff see priority, context and next action. A separate judge workspace exposes the technical decision trail."],
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-white/65">{text}</p></article>)}
          </div>
          <p className="mt-8 text-sm leading-7 text-white/50">Built with Next.js, OpenAI models, Jev specialist routing, Neon personal memory and Supabase authentication and care records. Telegram scheduled outreach requires an authorised worker; WhatsApp live delivery depends on business verification.</p>
        </section>
        <section id="reflection" className="scroll-mt-24 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">What this project explores</h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">The product challenge goes beyond generating a helpful reply. Useful care coordination needs continuity: what changed, what evidence supports it, and who follows up? TrustKaki brings those pieces into a workflow that people can inspect and act on.</p>
          <p className="mt-4 max-w-3xl leading-8 text-white/65">The hackathon win is a milestone. Staff review time, context accuracy and time to human follow-up are still outcomes to validate in a pilot. This is a hackathon prototype, not a clinically validated care service.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://trustkaki.vercel.app" target="_blank" rel="noopener noreferrer" className={button}>Explore the live project ↗</a>
            <Link href="/" className={button}>Back to portfolio →</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
