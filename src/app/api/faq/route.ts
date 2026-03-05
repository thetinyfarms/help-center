import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface FaqArticle {
  slug: string;
  title: string;
  category: string;
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

function loadArticlesFromDir(dir: string, category: string): FaqArticle[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file.replace(/\.md$/, ""),
      category,
      order: parseInt(data.order || "99", 10),
      content,
    };
  });
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "en";
  const categoryFilter = request.nextUrl.searchParams.get("category") || null;
  const contentRoot = path.join(process.cwd(), "content", "faq");

  const localeDir = path.join(contentRoot, locale);
  const fallbackDir = path.join(contentRoot, "en");
  const baseDir = fs.existsSync(localeDir) ? localeDir : fallbackDir;

  // Read category subfolders
  const categories = categoryFilter
    ? [categoryFilter]
    : fs.readdirSync(baseDir).filter((f) =>
        fs.statSync(path.join(baseDir, f)).isDirectory()
      );

  let articles: FaqArticle[] = [];
  for (const cat of categories) {
    const catDir = path.join(baseDir, cat);
    articles.push(...loadArticlesFromDir(catDir, cat));
  }

  // Sort by category, then order
  articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });

  return Response.json({ articles });
}
