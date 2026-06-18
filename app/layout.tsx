import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AskAI } from "@/components/AskAI";
import { Footer } from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://vpnscorecard.com";
const SITE_DESC =
  "An independent, non-commercial comparison of VPN tools across privacy, security, transparency, value and ethics. Every claim is sourced, and we take no money from the VPNs we rank.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "IP3 Studio",
      url: "https://ip3.studio",
      sameAs: [
        "https://x.com/ip3studio",
        "https://www.linkedin.com/company/ip3-studio",
        "https://github.com/IP3-Studio",
      ],
    },
    {
      "@type": "WebSite",
      name: "VPN Scorecard",
      url: SITE_URL,
      description: SITE_DESC,
      publisher: { "@type": "Organization", name: "IP3 Studio", url: "https://ip3.studio" },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VPN Scorecard: independent, non-commercial VPN comparison",
    template: "%s | VPN Scorecard",
  },
  description: SITE_DESC,
  applicationName: "VPN Scorecard",
  keywords: [
    "VPN comparison",
    "VPN privacy",
    "no-logs VPN",
    "audited VPN",
    "open-source VPN",
    "mixnet VPN",
    "VPN jurisdiction",
    "VPN reviews",
    "private VPN",
  ],
  authors: [{ name: "IP3 Studio", url: "https://ip3.studio" }],
  creator: "IP3 Studio",
  publisher: "IP3 Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "VPN Scorecard",
    title: "VPN Scorecard: independent, non-commercial VPN comparison",
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VPN Scorecard",
    description: SITE_DESC,
    site: "@ip3studio",
    creator: "@ip3studio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "technology",
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <AskAI />
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
