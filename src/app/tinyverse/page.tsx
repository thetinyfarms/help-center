"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/app/context/LanguageContext";
import { fetchFaqArticles, type FaqArticle } from "@/lib/faq";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/lang/LanguageSelector";
import { Menu, X } from "lucide-react";

export default function TinyversePage() {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [articles, setArticles] = useState<FaqArticle[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchFaqArticles(locale, "tinyverse").then((data) => {
      setArticles(data);
      if (data.length > 0 && !activeSlug) {
        setActiveSlug(data[0].slug);
      }
    });
  }, [locale]);

  const activeArticle = articles.find((a) => a.slug === activeSlug) || null;

  return (
    <div className="flex min-h-screen flex-col bg-background bg-dotted">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-md bg-background/95 backdrop-blur px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              &larr; {t("nav.backToHome")}
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-semibold sm:block">Tinyverse</span>
          <LanguageSelector variant="ghost" size="sm" subtle dropdownAlign="end" />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-md bg-card/50 backdrop-blur lg:block">
          <SidebarContent
            articles={articles}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
            t={t}
          />
        </aside>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-card backdrop-blur shadow-xl lg:hidden">
              <div className="pt-16">
                <SidebarContent
                  articles={articles}
                  activeSlug={activeSlug}
                  onSelect={(slug) => {
                    setActiveSlug(slug);
                    setSidebarOpen(false);
                  }}
                  t={t}
                />
              </div>
            </aside>
          </>
        )}

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-3xl space-y-10">
            {/* Header */}
            <section>
              <h1 className="mb-2 text-2xl font-bold">{t("tinyverse.title")}</h1>
              <p className="text-muted-foreground">{t("tinyverse.subtitle")}</p>
            </section>

            {/* Divider */}
            <hr className="border-t border-md" />

            {/* Article content */}
            {activeArticle ? (
              <article className="article-content">
                <ReactMarkdown>{activeArticle.content}</ReactMarkdown>
              </article>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                {articles.length === 0 ? "Loading..." : t("help.notFound")}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  articles,
  activeSlug,
  onSelect,
  t,
}: {
  articles: FaqArticle[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("help.articles")}
      </h2>
      {articles.map((article) => {
        const isActive = article.slug === activeSlug;
        return (
          <button
            key={article.slug}
            onClick={() => onSelect(article.slug)}
            className={`cursor-pointer rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors ${
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-foreground/70 hover:bg-secondary/60"
            }`}
          >
            {article.title}
          </button>
        );
      })}
    </nav>
  );
}
