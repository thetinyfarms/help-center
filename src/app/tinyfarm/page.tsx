"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/app/context/LanguageContext";
import { fetchFaqArticles, type FaqArticle } from "@/lib/faq";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/lang/LanguageSelector";
import { Menu, X, ChevronRight } from "lucide-react";

const DEVICES = [
  { id: "tinyfarm-v1_0", key: "v1_0", badgeKey: "original" },
  { id: "tinyfarm-v1_5", key: "v1_5", badgeKey: "latest" },
] as const;

export default function TinyfarmPage() {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [articles, setArticles] = useState<FaqArticle[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchFaqArticles(locale, "tinyfarm").then((data) => {
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
          <span className="hidden text-sm font-semibold sm:block">Tinyfarm</span>
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
            {/* Device cards */}
            <section>
              <h1 className="mb-2 text-2xl font-bold">{t("tinyfarm.title")}</h1>
              <p className="mb-6 text-muted-foreground">{t("tinyfarm.subtitle")}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {DEVICES.map((device) => (
                  <Link key={device.id} href={`/flash/${device.id}`} className="no-underline">
                    <Card
                      size="sm"
                      className="group cursor-pointer border-green-300 bg-green-50 shadow-green-200 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-300 dark:border-green-700 dark:bg-green-950 dark:shadow-green-800 dark:hover:shadow-green-700"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base text-green-800 dark:text-green-200">
                            {t(`devices.${device.key}.name`)}
                          </CardTitle>
                          <Badge
                            variant={device.badgeKey === "latest" ? "default" : "secondary"}
                            className={
                              device.badgeKey === "latest"
                                ? "bg-green-600 text-white"
                                : "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
                            }
                          >
                            {t(`common.${device.badgeKey}`)}
                          </Badge>
                        </div>
                        <CardDescription className="text-green-700/70 dark:text-green-300/70">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition-all group-hover:gap-2 dark:text-green-400">
                            {t("common.flashFirmware")} <ChevronRight className="size-4" />
                          </span>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
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
