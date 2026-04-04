import type { MetadataRoute } from "next";
import { FIRM_WEBSITE_URL } from "@/lib/firm-contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FIRM_WEBSITE_URL;
const allowIndexing = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
