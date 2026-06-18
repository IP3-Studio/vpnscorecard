import Link from "next/link";

const SITE_LINKS = [
  { href: "/", label: "Compare" },
  { href: "/recommend", label: "Find my VPN" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const STUDIO_LINKS = [
  { href: "https://ip3.studio", label: "ip3.studio" },
  { href: "https://x.com/ip3studio", label: "X / Twitter" },
  { href: "https://www.linkedin.com/company/ip3-studio", label: "LinkedIn" },
  { href: "https://github.com/IP3-Studio/vpnscorecard", label: "Source on GitHub" },
];

const linkCls =
  "hover:text-emerald-600 dark:hover:text-emerald-400";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-zinc-50/50 dark:border-zinc-800/70 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
              VPN Scorecard
            </div>
            <p>
              An independent, non-commercial comparison of VPN tools. We take no
              money from the services we rank and run{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">
                no affiliate links
              </strong>
              .
            </p>
            <p className="mt-3 text-xs">
              A project of{" "}
              <a
                href="https://ip3.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-800 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400"
              >
                IP3 Studio ↗
              </a>
            </p>
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2">
              <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Site
              </span>
              {SITE_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-col gap-2">
              <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                IP3 Studio
              </span>
              {STUDIO_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 space-y-2 border-t border-zinc-200/70 pt-6 text-xs leading-relaxed dark:border-zinc-800/70">
          <p>
            <strong className="text-zinc-700 dark:text-zinc-300">
              Informational only.
            </strong>{" "}
            Not legal, security, or financial advice. Scores reflect our{" "}
            <Link href="/methodology" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              published methodology
            </Link>{" "}
            and editorial judgement; data is point-in-time and may be out of date —
            always verify on the provider&apos;s own site. We are not affiliated with
            any VPN listed. Read the full{" "}
            <Link href="/disclaimer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              disclaimer
            </Link>
            .
          </p>
          <p>
            Comparison framework adapted from{" "}
            <a href="https://thatoneprivacysite.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              That One Privacy Site
            </a>{" "}
            under{" "}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              CC BY-NC-SA 4.0
            </a>
            . Visual approach inspired by{" "}
            <a href="https://privacytests.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              PrivacyTests.org
            </a>
            . © 2026 IP3 Studio.
          </p>
        </div>
      </div>
    </footer>
  );
}
