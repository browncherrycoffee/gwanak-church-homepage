import { MetadataRoute } from "next";

const BASE_URL = "https://gwanak-church-homepage.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/about`, priority: 0.9 },
    { url: `${BASE_URL}/sunday-sermon`, priority: 0.9 },
    { url: `${BASE_URL}/dawn-prayer`, priority: 0.8 },
    { url: `${BASE_URL}/friday-prayer`, priority: 0.8 },
    { url: `${BASE_URL}/catechism`, priority: 0.8 },
    { url: `${BASE_URL}/psalm-song`, priority: 0.8 },
    { url: `${BASE_URL}/bulletin`, priority: 0.8 },
    { url: `${BASE_URL}/notices`, priority: 0.7 },
    { url: `${BASE_URL}/community`, priority: 0.6 },
    { url: `${BASE_URL}/gallery`, priority: 0.6 },
    { url: `${BASE_URL}/calendar`, priority: 0.6 },
  ] as const;

  return staticRoutes.map((route) => ({
    url: route.url,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
}
