import Link from "next/link";

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
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Compare</Link>
              <Link href="/recommend" className="hover:text-emerald-600 dark:hover:text-emerald-400">Find my VPN</Link>
              <Link href="/methodology" className="hover:text-emerald-600 dark:hover:text-emerald-400">Methodology</Link>
              <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400">About</Link>
            </nav>
            <nav className="flex flex-col gap-2">
              <a href="https://github.com/IP3-Studio" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400">IP3 Studio</a>
              <a href="https://privacytests.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400">Inspired by PrivacyTests</a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200/70 pt-6 text-xs leading-relaxed dark:border-zinc-800/70">
          <p>
            Comparison framework adapted from{" "}
            <a href="https://thatoneprivacysite.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              That One Privacy Site
            </a>
            , licensed{" "}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
              CC BY-NC-SA 4.0
            </a>
            . Data is re-researched from primary sources and reflects a point in
            time — always verify on the provider&apos;s own site. A project of IP3 Studio.
          </p>
        </div>
      </div>
    </footer>
  );
}
