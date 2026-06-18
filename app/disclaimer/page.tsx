import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "VPN Scorecard is an independent, non-commercial, informational project. Independence, accuracy, scoring, lawful use, trademarks and liability.",
};

function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{children}</p>
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Disclaimer</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        VPN Scorecard is an independent, non-commercial research project by{" "}
        <a
          href="https://ip3.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:underline dark:text-emerald-400"
        >
          IP3 Studio
        </a>
        . Please read this before relying on anything here.
      </p>

      <div className="mt-8 space-y-6 text-sm">
        <Item title="Independence">
          We are not affiliated with, sponsored by, or paid by any VPN we list,
          and we run <strong>no affiliate links</strong>. Our only goal is an
          honest comparison.
        </Item>
        <Item title="Informational only">
          This site is provided for general information and education. It is{" "}
          <strong>not legal, security, or financial advice</strong> and should not
          be relied on as such. Choose tools based on your own situation and, where
          it matters, seek qualified professional advice.
        </Item>
        <Item title="No guarantee of accuracy">
          VPNs change ownership, pricing, and policies frequently. Our data reflects
          a point in time, may be incomplete or contain errors, and can become
          outdated. Always verify details on the provider&apos;s official site. We
          make no warranties, express or implied, as to accuracy or completeness.
        </Item>
        <Item title="Scores are our methodology, not objective fact">
          Ratings reflect our published{" "}
          <Link href="/methodology" className="text-emerald-600 hover:underline dark:text-emerald-400">
            methodology
          </Link>{" "}
          and editorial judgement. Reasonable people may weight criteria
          differently, and a score is not a guarantee of any provider&apos;s
          security, privacy, or suitability for you.
        </Item>
        <Item title="No tool is perfect">
          No VPN, or any single tool, provides perfect anonymity or security. A VPN
          is one part of a broader privacy strategy, and the right choice depends on
          your own threat model.
        </Item>
        <Item title="Lawful use">
          VPNs are legal in most countries but restricted in some. You are
          responsible for complying with the laws that apply to you. Nothing here
          encourages unlawful activity or the circumvention of applicable laws.
        </Item>
        <Item title="Trademarks">
          All product names, logos, and brands are the property of their respective
          owners. Their use here is for identification and comparison only and does
          not imply any endorsement or affiliation.
        </Item>
        <Item title="No liability">
          To the fullest extent permitted by law, IP3 Studio accepts no liability for
          any loss or damage arising from use of, or reliance on, this site. Spotted
          an error?{" "}
          <a
            href="https://github.com/IP3-Studio/vpnscorecard/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Corrections are welcome
          </a>
          .
        </Item>
      </div>

      <p className="mt-8 text-sm">
        <Link href="/" className="text-emerald-600 hover:underline dark:text-emerald-400">
          ← Back to the comparison
        </Link>
      </p>
    </div>
  );
}
