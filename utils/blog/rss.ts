import fs from "fs";
import path from "path";
import { Feed } from "feed";

import { readAllPosts } from "./posts";

const SITE_URL = "https://ailab.ijs.si/eriknovak";

export function writeRssFeed(): void {
  const posts = readAllPosts();

  const feed = new Feed({
    title: "Erik Novak — Blog",
    description: "Notes, essays, and research write-ups by Erik Novak.",
    id: `${SITE_URL}/blog/`,
    link: `${SITE_URL}/blog/`,
    language: "en",
    image: `${SITE_URL}/imgs/profile.jpg`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Erik Novak`,
    feedLinks: { rss2: `${SITE_URL}/blog/rss.xml` },
    author: { name: "Erik Novak" },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.year}/${post.slug}/`,
      link: `${SITE_URL}/blog/${post.year}/${post.slug}/`,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((t) => ({ name: t })),
    });
  }

  const outDir = path.join(process.cwd(), "public", "blog");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "rss.xml"), feed.rss2(), "utf8");
}
