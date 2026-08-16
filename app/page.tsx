import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VerifyAI — Faster identity verification for credit unions and banks",
  description:
    "VerifyAI speeds up customer verification for credit unions and banks with a secure, silent link — no sensitive information spoken aloud, deployable in days.",
};

/* ---------- Icons (inline, no external icon library) ---------- */

function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5 4 5.5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10v-6L12 2.5Z"
        fill="currentColor"
      />
      <path
        d="m8.5 12.2 2.4 2.4 4.6-4.8"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 15 15 9M10.5 6.5 12 5a4 4 0 1 1 5.7 5.7l-1.5 1.5M13.5 17.5 12 19a4 4 0 1 1-5.7-5.7l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFingerprint({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 1 9 9M12 3a9 9 0 0 0-9 9v2M12 7a5 5 0 0 1 5 5v1M12 7a5 5 0 0 0-5 5v3a4 4 0 0 0 1 2.6M12 11a1 1 0 0 1 1 1v2.5a5.5 5.5 0 0 0 2.3 4.5M9.5 11.5v3a2.5 2.5 0 0 0 2 2.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUnlock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
      <path
        d="M8.5 11V8a3.5 3.5 0 0 1 6.7-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.4" fill="#fff" />
    </svg>
  );
}

function IconLock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.4" fill="#fff" />
    </svg>
  );
}

function IconDevice({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" fill="currentColor" />
      <rect x="8" y="5" width="8" height="12.5" rx="0.5" fill="#0f172a" />
      <circle cx="12" cy="19.2" r="1" fill="#fff" />
    </svg>
  );
}

function IconBadgeCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m12 2.5 2.2 1.3 2.5-.3 1 2.3 2.3 1-.3 2.5L21 12l-1.3 2.2.3 2.5-2.3 1-1 2.3-2.5-.3L12 21.5l-2.2-1.3-2.5.3-1-2.3-2.3-1 .3-2.5L3 12l1.3-2.2-.3-2.5 2.3-1 1-2.3 2.5.3L12 2.5Z"
        fill="currentColor"
      />
      <path
        d="m8.5 12.3 2.3 2.3 4.7-4.9"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBolt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
    </svg>
  );
}

function IconCalendar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="currentColor" />
      <path d="M3.5 9.5h17" stroke="#0f172a" strokeWidth="1.4" />
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 13h3M13.5 13h3M7.5 16.5h3" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconMicOff({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 5.5a3 3 0 0 1 6 0v5a3 3 0 0 1-.4 1.5M12 15.5a5.5 5.5 0 0 1-5.5-5.5v-1M17.5 9v1a5.5 5.5 0 0 1-1 3.2M12 15.5v4M9 19.5h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 4 20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Logo({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.svg" alt="" className={className} />;
}

/* ---------- Shared bits ---------- */

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#security", label: "Security" },
  { href: "#contact", label: "Contact" },
];

const COMPLIANCE_BADGES = [
  { label: "SOC 2 in process", icon: IconBadgeCheck },
  { label: "GDPR", icon: IconBadgeCheck },
  { label: "CCPA", icon: IconBadgeCheck },
];

function ComplianceBadges({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const chip =
    tone === "dark"
      ? "border-white/15 bg-white/5 text-slate-200"
      : "border-slate-200 bg-white text-slate-600";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {COMPLIANCE_BADGES.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${chip}`}
        >
          <Icon className="h-4 w-4 text-[#0066FF]" />
          {label}
        </span>
      ))}
    </div>
  );
}

function PrimaryButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="mailto:contact@verifyai.llc?subject=Request%20a%20Pilot"
      className={`inline-flex items-center justify-center rounded-lg bg-[#0066FF] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#0066FF]/25 transition hover:bg-[#0052cc] ${className}`}
    >
      {children}
    </a>
  );
}

/* ---------- Page ---------- */

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#132745] to-[#1e3a5f] text-white"
      >
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#0066FF]/10 blur-3xl" />

        <header className="relative z-10">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
            <a href="#top" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight">VerifyAI</span>
            </a>
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <PrimaryButton className="hidden !px-5 !py-2.5 text-sm md:inline-flex">
              Request a Pilot
            </PrimaryButton>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-10 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-32 lg:pt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#4f8dff]">
              Identity verification, reimagined
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Is your customer verification taking too long?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              We will solve it. Speed up identity verification for credit unions and
              banks &mdash; no sensitive information spoken aloud, ever.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <PrimaryButton>Request a Pilot</PrimaryButton>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-slate-200 underline decoration-slate-500 underline-offset-4 transition hover:text-white"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Illustration placeholder: shield + phone */}
          <div className="relative mx-auto flex h-80 w-full max-w-sm items-center justify-center sm:h-96">
            <div className="absolute h-64 w-64 rounded-full bg-[#0066FF]/25 blur-2xl" />
            <div className="relative flex h-72 w-40 items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm sm:h-80 sm:w-44">
              <div className="absolute top-3 h-1 w-10 rounded-full bg-white/20" />
              <Logo className="h-20 w-20 drop-shadow-[0_0_24px_rgba(0,102,255,0.65)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-[#0f172a] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Verify with confidence. In seconds.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              A silent, secure flow that replaces knowledge-based questions with a
              link the caller taps on their own phone.
            </p>
          </div>

          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: IconMicOff,
                title: "Caller agrees",
                body: "The rep asks for verbal consent to send a one-time verification text.",
              },
              {
                icon: IconLink,
                title: "Secure link",
                body: "VerifyAI texts a one-time secure link to the phone number on file.",
              },
              {
                icon: IconFingerprint,
                title: "Biometric",
                body: "The caller taps the link and confirms with device biometrics.",
              },
              {
                icon: IconUnlock,
                title: "Dashboard unlocks",
                body: "The rep's dashboard unlocks instantly — nothing was ever spoken aloud.",
              },
            ].map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0066FF]/15 text-[#4f8dff]">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-20 flex flex-col items-center gap-5 border-t border-white/10 pt-10 sm:flex-row sm:justify-between">
            <p className="text-sm font-medium text-slate-400">
              Built to meet the compliance bar financial institutions expect.
            </p>
            <ComplianceBadges tone="dark" />
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="benefits" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
              Why teams switch to VerifyAI
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Faster calls, fewer fraud losses, and a rollout your ops team can
              finish before quarter end.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: IconShield,
                title: "Fraud protection",
                body: "Device-bound biometric checks make it dramatically harder for social engineers to pass as your members.",
              },
              {
                icon: IconMicOff,
                title: "Nothing spoken",
                body: "No PINs, SSNs, or security answers read aloud — so nothing can be overheard or recorded.",
              },
              {
                icon: IconBolt,
                title: "Faster verification",
                body: "What used to take minutes of back-and-forth questions now completes in seconds.",
              },
              {
                icon: IconCalendar,
                title: "Deploy in days",
                body: "No contact-center integration project required. Most teams are live within a week.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                  <card.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#0f172a]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {card.body}
                </p>
                <div className="mt-5 h-1 w-10 rounded-full bg-[#0066FF] transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECURITY & TRUST ================= */}
      <section id="security" className="bg-[#1e3a5f] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Bank-grade security you can trust.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Every verification is encrypted end to end and confirmed on the
              caller&apos;s own device &mdash; never on your rep&apos;s screen alone.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: IconLock,
                title: "Encryption",
                body: "All data is encrypted in transit and at rest using industry-standard protocols.",
              },
              {
                icon: IconDevice,
                title: "Device-side verification",
                body: "Biometric checks happen locally on the caller's phone; secrets never cross the wire.",
              },
              {
                icon: IconBadgeCheck,
                title: "Compliance",
                body: "Built with the audit trail and controls financial institutions and their regulators expect.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF]/20 text-[#4f8dff]">
                  <card.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center border-t border-white/10 pt-10">
            <ComplianceBadges tone="dark" />
          </div>
        </div>
      </section>

      {/* ================= MOBILE ================= */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066FF]">
              Mobile-first by design
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
              Built for the phone in your member&apos;s hand.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              The verification link opens straight in the browser &mdash; no app to
              download, no account to create. It&apos;s designed to work in under
              ten seconds on any screen size.
            </p>
          </div>

          <div className="mx-auto flex justify-center">
            <div className="relative flex h-[26rem] w-56 flex-col items-center rounded-[2.25rem] border-8 border-[#0f172a] bg-[#0f172a] p-3 shadow-2xl">
              <div className="absolute top-3 h-1 w-10 rounded-full bg-white/20" />
              <div className="mt-6 flex h-full w-full flex-col rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-[#0f172a]">
                  <Logo className="h-5 w-5" />
                  <span className="text-xs font-bold">VerifyAI</span>
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Confirm it&apos;s you
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Verifying for Member ID &bull;&bull;&bull;&bull;42
                </p>
                <div className="mt-6 flex flex-1 items-center justify-center">
                  <IconFingerprint className="h-16 w-16 text-[#0066FF]" />
                </div>
                <div className="rounded-lg bg-[#0066FF] py-2.5 text-center text-xs font-semibold text-white">
                  Use Face ID
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER / CTA ================= */}
      <footer id="contact" className="bg-[#0f172a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to protect your members?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Talk to us about a pilot &mdash; most teams are live within a week.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton>Request a Pilot</PrimaryButton>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <a href="#top" className="flex items-center gap-2.5">
                <Logo className="h-8 w-8" />
                <span className="text-lg font-bold tracking-tight">VerifyAI</span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                Faster, silent identity verification for credit unions and banks.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200">
                  <IconBadgeCheck className="h-4 w-4 text-[#0066FF]" />
                  SOC 2 in process
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200">
                  <IconLock className="h-4 w-4 text-[#0066FF]" />
                  Bank-grade security
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li><a href="#how-it-works" className="transition hover:text-white">How it works</a></li>
                <li><a href="#benefits" className="transition hover:text-white">Benefits</a></li>
                <li><a href="#security" className="transition hover:text-white">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Solutions</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li><span>Credit unions</span></li>
                <li><span>Community banks</span></li>
                <li><span>Contact centers</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li><a href="/privacy" className="transition hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="transition hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row lg:px-8">
              <p>&copy; 2026 VerifyAI &middot; Indianapolis, IN</p>
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
                <a href="mailto:contact@verifyai.llc" className="transition hover:text-white">
                  contact@verifyai.llc
                </a>
                <span className="hidden sm:inline">&middot;</span>
                <a href="tel:+18333509518" className="transition hover:text-white">
                  +1 (833) 350-9518
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
