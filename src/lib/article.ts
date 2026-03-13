export interface Article {
  slug: string;
  title: string;
  category: string;
  section: string;
  sectionSlug: string;
  sectionOrder: number;
  order: number;
  content: string;
}

export async function fetchArticles(
  locale: string,
  category?: string
): Promise<Article[]> {
  const params = new URLSearchParams({ locale });
  if (category) params.set("category", category);
  const res = await fetch(`/api/article?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles;
}
