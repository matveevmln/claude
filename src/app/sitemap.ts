import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/offer", "/privacy", "/login"];
  return routes.map((route) => ({
    url: `${site.domain}${route}`,
    lastModified: new Date(),
  }));
}
