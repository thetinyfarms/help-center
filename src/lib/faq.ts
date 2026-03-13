export interface FaqArticle {
  slug: string;
  title: string;
  category: string;
  section: string;
  sectionSlug: string;
  sectionOrder: number;
  order: number;
  content: string;
}

export async function fetchFaqArticles(
  locale: string,
  category?: string
): Promise<FaqArticle[]> {
  const params = new URLSearchParams({ locale });
  if (category) params.set("category", category);
  const res = await fetch(`/api/faq?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles;
}
