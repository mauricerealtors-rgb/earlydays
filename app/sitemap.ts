import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS, REGIONS } from "@/data/locations";
import {
  allListings,
  listingsByCategoryAndLocation,
  listingsByCategoryAndRegion,
  listingsByLocation,
  listingsByRegion,
} from "@/lib/query";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const items: MetadataRoute.Sitemap = [];

  // Core static routes
  const staticRoutes = [
    "",
    "/schools",
    "/guides",
    "/for-schools",
    "/claim",
    "/about",
    "/contact",
  ];
  for (const r of staticRoutes) {
    items.push({
      url: `${SITE.url}${r || "/"}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: r === "" ? 1 : 0.7,
    });
  }

  // Categories
  for (const c of CATEGORIES) {
    items.push({
      url: `${SITE.url}/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Regions
  for (const r of REGIONS) {
    if (listingsByRegion(r.slug).length > 0) {
      items.push({
        url: `${SITE.url}/schools/${r.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Region + area (only where listings exist — guide §16)
  for (const l of LOCATIONS) {
    if (listingsByLocation(l.slug).length > 0) {
      items.push({
        url: `${SITE.url}/schools/${l.region}/${l.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // Category + region
  for (const c of CATEGORIES) {
    for (const r of REGIONS) {
      if (listingsByCategoryAndRegion(c.slug, r.slug).length > 0) {
        items.push({
          url: `${SITE.url}/${c.slug}/${r.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  // Category + region + area
  for (const c of CATEGORIES) {
    for (const l of LOCATIONS) {
      if (listingsByCategoryAndLocation(c.slug, l.slug).length > 0) {
        items.push({
          url: `${SITE.url}/${c.slug}/${l.region}/${l.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }
  }

  // School profiles
  for (const s of allListings()) {
    items.push({
      url: `${SITE.url}/schools/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return items;
}
