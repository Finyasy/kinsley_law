import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.kinsleylaw.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kinsley Advocates",
    template: "%s | Kinsley Advocates",
  },
  description:
    "Kinsley Advocates delivers dignified, strategic legal counsel for private clients, families, founders, investors, and businesses in Nairobi.",
  applicationName: "Kinsley Advocates",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Kinsley Advocates",
    title: "Kinsley Advocates",
    description:
      "Strategic legal counsel for private clients, businesses, investors, disputes, and mineral-sector matters in Nairobi.",
    images: [
      {
        url: "/images/kinsley-logo-new.png",
        width: 512,
        height: 512,
        alt: "Kinsley Advocates logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinsley Advocates",
    description:
      "Strategic legal counsel for private clients, businesses, investors, disputes, and mineral-sector matters in Nairobi.",
    images: ["/images/kinsley-logo-new.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <div className="site-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
