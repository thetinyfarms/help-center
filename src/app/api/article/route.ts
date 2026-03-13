import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface Article {
  slug: string;
  title: string;
  category: string;
  section: string;
  sectionSlug: string;
  sectionOrder: number;
  order: number;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2] };
}

function parseSectionFromFolder(folderName: string): { order: number; slug: string; defaultName: string } {
  // Extract section order and slug from folder name like "01-getting-started"
  const match = folderName.match(/^(\d+)-(.+)$/);
  if (match) {
    return {
      order: parseInt(match[1], 10),
      slug: match[2],
      defaultName: match[2].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    };
  }
  // Fallback for folders without prefix
  return {
    order: 99,
    slug: folderName,
    defaultName: folderName.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
  };
}

function loadArticlesFromDir(dir: string, category: string, folderName: string): Article[] {
  if (!fs.existsSync(dir)) return [];

  const sectionInfo = parseSectionFromFolder(folderName);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  // Read first file to check for section name override
  let sectionName = sectionInfo.defaultName;
  if (files.length > 0) {
    const firstFile = fs.readFileSync(path.join(dir, files[0]), "utf-8");
    const { data } = parseFrontmatter(firstFile);
    if (data.section) {
      sectionName = data.section;
    }
  }

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file.replace(/\.md$/, ""),
      category,
      section: data.section || sectionName,
      sectionSlug: sectionInfo.slug,
      sectionOrder: sectionInfo.order,
      order: parseInt(data.order || "99", 10),
      content,
    };
  });
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "en";
  const categoryFilter = request.nextUrl.searchParams.get("category") || null;
  const contentRoot = path.join(process.cwd(), "content", "articles");

  const localeDir = path.join(contentRoot, locale);
  const fallbackDir = path.join(contentRoot, "en");
  const baseDir = fs.existsSync(localeDir) ? localeDir : fallbackDir;

  // Read category subfolders
  const categories = categoryFilter
    ? [categoryFilter]
    : fs.readdirSync(baseDir).filter((f) =>
        fs.statSync(path.join(baseDir, f)).isDirectory()
      );

  let articles: Article[] = [];
  for (const cat of categories) {
    const catDir = path.join(baseDir, cat);

    // Check if category has section subfolders
    const items = fs.readdirSync(catDir);
    const subfolders = items.filter((item) =>
      fs.statSync(path.join(catDir, item)).isDirectory()
    );

    if (subfolders.length > 0) {
      // Load articles from section subfolders
      for (const folder of subfolders) {
        const sectionDir = path.join(catDir, folder);
        articles.push(...loadArticlesFromDir(sectionDir, cat, folder));
      }
    } else {
      // Load articles directly from category folder (no sections)
      articles.push(...loadArticlesFromDir(catDir, cat, cat));
    }
  }

  // Sort by category, section order, then article order
  articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.sectionOrder !== b.sectionOrder) return a.sectionOrder - b.sectionOrder;
    return a.order - b.order;
  });

  return Response.json({ articles });
}
