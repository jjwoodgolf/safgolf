import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://safgolf.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/events", changefreq: "weekly", priority: "0.8" },
  { path: "/programs", changefreq: "monthly", priority: "0.9" },
  { path: "/programs/junior-golf", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/college-scholarships", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/veterans", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/showcase-events", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/recruiting", changefreq: "monthly", priority: "0.7" },
  { path: "/success-stories", changefreq: "monthly", priority: "0.8" },
  { path: "/sponsors", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/donate", changefreq: "monthly", priority: "1.0" },
];

const urls = entries
  .map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
