import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/api"] },
    ],
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
