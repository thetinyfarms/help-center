"use client";

import { useEffect, useState, useRef, memo, useMemo, useCallback, startTransition } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/app/context/LanguageContext";
import { fetchArticles, type Article } from "@/lib/article";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/lang/LanguageSelector";
import { ArrowLeft, ChevronDown, Home, Menu, Search, X } from "lucide-react";
import { Orbie } from "@/components/ui/orbie";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TinyversePage() {
  const t = useTranslations();
  const { locale } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [isManualClick, setIsManualClick] = useState(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchArticles(locale, "tinyverse").then((data) => {
      setArticles(data);

      // Check if there's an article in the URL path (e.g., /tinyverse/section/article)
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length >= 3 && pathParts[0] === 'tinyverse') {
        const sectionPath = pathParts[1];
        const articlePath = pathParts[2];

        // Find article by matching section and article slugs (without number prefixes)
        const article = data.find(a => {
          const articleSlugWithoutNumber = a.slug.replace(/^\d+-/, '');
          const sectionSlugWithoutNumber = a.sectionSlug.replace(/^\d+-/, '');
          return sectionSlugWithoutNumber === sectionPath && articleSlugWithoutNumber === articlePath;
        });

        if (article) {
          setActiveSlug(article.slug);
          return;
        }
      }

      // Fallback: Check if there's an article in the URL query params (old format)
      const articleParam = searchParams.get('article');
      if (articleParam && data.find(a => a.slug === articleParam)) {
        setActiveSlug(articleParam);
      } else if (data.length > 0 && !activeSlug) {
        setActiveSlug(data[0].slug);
      }
    });
  }, [locale, pathname, searchParams, activeSlug]);

  const activeArticle = articles.find((a) => a.slug === activeSlug) || null;

  // Update URL when active article changes
  const handleArticleSelect = useCallback((slug: string) => {
    const article = articles.find(a => a.slug === slug);
    if (!article) return;

    // Use startTransition to make the state update non-blocking
    startTransition(() => {
      setActiveSlug(slug);
    });

    // Use the section slug (without numbers) and article slug for clean URLs
    const sectionPath = article.sectionSlug.replace(/^\d+-/, ''); // Remove leading numbers
    const articlePath = slug.replace(/^\d+-/, ''); // Remove leading numbers

    // Use window.history.pushState to update URL without triggering navigation
    window.history.pushState(null, '', `/tinyverse/${sectionPath}/${articlePath}`);
  }, [articles]);

  useEffect(() => {
    // Scroll to top when active article changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeSlug]);

  // Extract headings from markdown content
  useEffect(() => {
    if (!activeArticle?.content) {
      setHeadings([]);
      return;
    }

    const extractedHeadings: Heading[] = [];
    const lines = activeArticle.content.split('\n');

    lines.forEach((line) => {
      // Strip carriage returns to handle Windows line endings
      const cleanLine = line.replace(/\r/g, '');

      const match = cleanLine.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [activeArticle]);

  // Track active heading on scroll
  useEffect(() => {
    if (!scrollContainerRef.current || !contentRef.current || headings.length === 0) return;

    const updateActiveHeading = () => {
      // Skip auto-update if user manually clicked a TOC item
      if (isManualClick) return;

      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll('h2[id], h3[id]');
      if (!headingElements || headingElements.length === 0) return;

      const viewportHeight = window.innerHeight;
      const targetPosition = viewportHeight * 0.5; // 50% from top

      // Find all headings that are currently visible
      const visible: { element: Element; top: number; distance: number }[] = [];

      headingElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distanceFromTarget = Math.abs(rect.top - targetPosition);

        // Include headings that are in viewport or just above
        if (rect.top < viewportHeight && rect.bottom > 0) {
          visible.push({ element: el, top: rect.top, distance: distanceFromTarget });
        }
      });

      if (visible.length > 0) {
        // Find heading closest to target position, preferring those above it
        const aboveTarget = visible.filter(h => h.top <= targetPosition);
        const target = aboveTarget.length > 0
          ? aboveTarget.sort((a, b) => b.top - a.top)[0] // Get closest to target from above
          : visible.sort((a, b) => a.distance - b.distance)[0]; // Or closest overall

        const id = target.element.id;
        if (id && id !== activeHeadingId) {
          setActiveHeadingId(id);
        }
      }
    };

    // Detect user scroll to re-enable auto-tracking
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleUserScroll = () => {
      // Ignore programmatic scrolls (from TOC clicks)
      if (isProgrammaticScrollRef.current) {
        return;
      }

      if (isManualClick && !isScrolling) {
        // User started scrolling - re-enable auto-tracking
        setIsManualClick(false);
      }

      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    // Small delay to ensure ReactMarkdown has rendered
    const timeoutId = setTimeout(() => {
      updateActiveHeading();

      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleUserScroll);
        scrollContainer.addEventListener('scroll', updateActiveHeading);
        window.addEventListener('resize', updateActiveHeading);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(scrollTimeout);
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleUserScroll);
        scrollContainer.removeEventListener('scroll', updateActiveHeading);
      }
      window.removeEventListener('resize', updateActiveHeading);
    };
  }, [activeArticle, headings, activeHeadingId, isManualClick]);

  const navbar = useMemo(() => (
    <header ref={headerRef} className="sticky z-50 top-0 flex items-center justify-center mx-auto w-full py-3 md:py-6 px-5 lg:px-6">
      <div className="flex items-center justify-between mx-auto w-full">
        <div className="flex w-fit items-center gap-3">
          <Link href="/" className="size-10 md:size-16 shrink-0">
            <img src="/assets/logos/logo-tiny.svg" alt="tiny logo" className="size-full" />
          </Link>
          {/* <div className="flex items-center gap-1 shrink-0">
            <Link href="/" className="text-lg font-heading text-heading font-medium tracking-tighter">
              Help Center
            </Link>
          </div> */}
          <Breadcrumb className="max-w-full p-1.5 !border-md border-muted bg-card/60 backdrop-blur-md rounded-sm transition-all duration-150">
            <BreadcrumbList>
              <BreadcrumbLink href="/" className="shrink-0">
                <Button variant="ghost" size="xs" className="h-6 font-heading tracking-tighter font-medium text-lg">
                  Help Center
                </Button>
              </BreadcrumbLink>
              
              <span className="disabled text-secondary-foreground">/</span>
              
              <BreadcrumbItem>
                <img src="/assets/logos/logo-tinyverse-wordmark.svg" alt="tinyverse" className="h-[1rem] mt-0.5" />
                <ChevronDown className="opacity-secondary" />
              </BreadcrumbItem>

              {/* <span className="text-lg disabled text-secondary-foreground">/</span>
              
              <BreadcrumbItem>
                v1.5
                <ChevronDown className="opacity-secondary" />
              </BreadcrumbItem> */}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="pr-8"
          >
            <Search />
            <span className="opacity-secondary font-normal">Search...</span>
          </Button>
          <LanguageSelector variant="secondary" size="default" dropdownAlign="end" />
          <Button
            variant="secondary"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  ), [sidebarOpen]);

  return (
    <>
      {/* Top bar */}
      {navbar}

      <div ref={scrollContainerRef} className="absolute top-0 left-0 w-[100dvw] h-[100dvh] flex gap-4 !pt-18 md:p-5 md:!pt-28 lg:p-6 overflow-y-auto">
          {/* Sidebar — desktop */}
          <aside className="sticky top-0 hidden w-[20%] min-w-64 h-full shrink-0 rounded-md bg-card-fill border-md border-muted/40 md:block flex flex-col overflow-y-auto">
            {/* <div className="sticky top-0 z-10 flex items-center justify-between w-full gap-1 px-4 py-4 bg-muted/46 backdrop-blur-md border-b border-muted">
              <Button variant="ghost" size="sm">
                <img src="/assets/logos/logo-tinyverse-wordmark.svg" alt="tinyverse" className="h-4.5 mt-0.5" />
                <ChevronDown className="opacity-secondary" />
              </Button>
              <Button variant="secondary" size="sm" className="font-semibold">
                v1.5
                <ChevronDown className="opacity-secondary" />
              </Button>
            </div> */}
            <SidebarContent
              articles={articles}
              activeSlug={activeSlug}
              onSelect={handleArticleSelect}
            />
          </aside>

          {/* Content area */}
          <main ref={contentRef} className="flex-1 flex gap-4 h-fit min-h-full">
            {/* Article content */}
            {activeArticle ? (
              <article className="article-content px-6 md:px-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h2 id={id}>{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h3 id={id}>{children}</h3>;
                    }
                  }}
                >
                  {activeArticle.content}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="size-full flex items-center justify-center py-12 text-center text-muted-foreground">
                <p>{articles.length === 0 ? "Loading..." : t("help.notFound")}</p>
              </div>
            )}
          </main>

          {/* Sidebar - TOC */}
          <aside className="sticky top-0 hidden w-[20%] pt-4 shrink-0 lg:block">
            <TableOfContents
              headings={headings}
              activeHeadingId={activeHeadingId}
              headerRef={headerRef}
              isProgrammaticScrollRef={isProgrammaticScrollRef}
              onHeadingClick={(id: string) => {
                setActiveHeadingId(id);
                setIsManualClick(true);
              }}
            />
          </aside>
        
        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 right-0 z-50 h-full w-fit max-w-full p-4 pt-6 overflow-y-auto rounded-l-md bg-secondary/40 backdrop-blur-lg lg:hidden">
              <SidebarContent
                articles={articles}
                activeSlug={activeSlug}
                onSelect={(slug) => {
                  handleArticleSelect(slug);
                  setSidebarOpen(false);
                }}
              />
            </aside>
          </>
        )}
      </div>
    </>
  );
}

const SidebarContent = memo(function SidebarContent({
  articles,
  activeSlug,
  onSelect,
}: {
  articles: Article[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  // Group articles by section
  const sections = articles.reduce((acc, article) => {
    const sectionKey = article.sectionSlug || article.section;
    if (!acc[sectionKey]) {
      acc[sectionKey] = {
        name: article.section,
        order: article.sectionOrder,
        articles: [],
      };
    }
    acc[sectionKey].articles.push(article);
    return acc;
  }, {} as Record<string, { name: string; order: number; articles: Article[] }>);

  // Sort sections by order
  const sortedSections = Object.entries(sections).sort(
    ([, a], [, b]) => a.order - b.order
  );

  return (
    <nav className="flex flex-col gap-8 px-4 py-7">
      {sortedSections.map(([sectionKey, section]) => (
        <div key={sectionKey} className="flex flex-col items-stretch">
          <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.name}
          </h2>
          <div className="flex flex-col items-start gap-1 border-l-2 border-secondary ml-2">
            {section.articles.map((article) => {
              const isActive = article.slug === activeSlug;
              return (
                <Button
                  key={article.slug}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect(article.slug)}
                  className={`justify-start text-sm font-medium -ml-0.5 px-3 py-1 rounded-l-none border-l-2 !bg-transparent !backdrop-blur-none text-left whitespace-normal max-w-full
                    ${
                    isActive
                      ? "text-secondary-foreground font-semibold border-primary"
                      : "text-foreground/60 hover:text-secondary-foreground hover:border-primary/30"
                  }
                  `}
                >
                  {article.title}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
});

function TableOfContents({
  headings,
  activeHeadingId,
  headerRef,
  isProgrammaticScrollRef,
  onHeadingClick,
}: {
  headings: Heading[];
  activeHeadingId: string | null;
  headerRef: React.RefObject<HTMLElement | null>;
  isProgrammaticScrollRef: React.RefObject<boolean>;
  onHeadingClick: (id: string) => void;
}) {

  const handleClick = (id: string) => {
    // Set active heading immediately
    onHeadingClick(id);

    const element = document.getElementById(id);
    if (!element) return;

    // Find the scroll container (the parent div with overflow-y-auto)
    const scrollContainer = element.closest('.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Mark this as a programmatic scroll
    isProgrammaticScrollRef.current = true;

    // Dynamically get the header height
    const headerHeight = headerRef.current?.offsetHeight || 112;
    const elementRect = element.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top;
    const targetScrollTop = scrollContainer.scrollTop + relativeTop - headerHeight;

    scrollContainer.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });

    // Clear the programmatic scroll flag after animation completes
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000); // Smooth scroll typically takes ~500-700ms, so 1s is safe
  };

  return (
    <nav className="flex flex-col gap-2">
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        In this article
      </h2>
      {headings.length > 0 && (
        <div className="flex-1 flex flex-col items-start gap-1 border-l-2 border-secondary ml-2">
          {headings.map((heading) => {
            const isActive = heading.id === activeHeadingId;
            // Calculate indentation based on heading level (h2 = 0, h3 = 1, etc.)
            const indentLevel = heading.level - 2;
            const paddingLeft = `${0.75 + indentLevel * 0.75}rem`; // 0.75rem base + 0.75rem per level

            return (
              <Button
                key={heading.id}
                variant="ghost"
                size="sm"
                onClick={() => handleClick(heading.id)}
                className={`justify-start text-sm font-medium -ml-0.5 px-3 py-1 rounded-l-none border-l-2 !bg-transparent !backdrop-blur-none text-left whitespace-normal max-w-full
                  ${
                  isActive
                    ? "text-secondary-foreground font-semibold border-primary"
                    : "text-foreground/60 hover:text-secondary-foreground hover:border-primary/30"
                }
                `}
                style={{ paddingLeft }}
              >
                {heading.text}
              </Button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
