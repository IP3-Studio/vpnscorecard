import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "VPN Scorecard is an independent, non-commercial VPN comparison project by IP3 Studio.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>

      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        VPN Scorecard is an independent, non-commercial project that compares
        VPN tools the way{" "}
        <a href="https://privacytests.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          PrivacyTests.org
        </a>{" "}
        compares browsers: openly, transparently, and without taking money from
        the products being measured.
      </p>

      <h2 className="mt-8 text-xl font-bold">Why this exists</h2>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Most VPN &ldquo;review&rdquo; sites are funded by affiliate commissions, so
        the highest-paying VPN tends to win. We do the opposite. Our rankings come
        from a{" "}
        <Link href="/methodology" className="text-emerald-600 hover:underline dark:text-emerald-400">
          published rubric
        </Link>
        , every fact is sourced, and we earn nothing if you sign up. The seed for
        this work is the much-loved comparison chart from{" "}
        <a href="https://thatoneprivacysite.net" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          That One Privacy Site
        </a>
        , which we are re-researching from primary sources and bringing up to date.
      </p>

      <h2 className="mt-8 text-xl font-bold">Our principles</h2>
      <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
        <li>· <strong>The rankings aren&apos;t for sale.</strong> We earn nothing if you sign up, and take no sponsorships or paid placement.</li>
        <li>· <strong>Sourced or unknown.</strong> We cite primary sources or say we don&apos;t know.</li>
        <li>· <strong>Transparent scoring.</strong> The whole rubric is public and the code is open.</li>
        <li>· <strong>Point-in-time honesty.</strong> Every record shows when it was last verified.</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">Who builds it</h2>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        A project of{" "}
        <a href="https://github.com/IP3-Studio" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          IP3 Studio
        </a>
        . The dataset and site are works in progress; we publish a VPN only once
        it has been re-verified, and add more in batches. Spotted something out of
        date or wrong? Corrections via the GitHub repository are very welcome.
      </p>

      <p className="mt-8 text-sm">
        <Link href="/" className="text-emerald-600 hover:underline dark:text-emerald-400">
          ← Back to the comparison
        </Link>
      </p>
    </div>
  );
}
