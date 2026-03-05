"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/lang/LanguageSelector";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center bg-background bg-dotted px-6 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Language selector */}
        <div className="flex justify-end">
          <LanguageSelector variant="ghost" size="sm" subtle dropdownAlign="end" />
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t('home.title')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Product cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Tinyfarm card */}
          <Link href="/tinyfarm" className="no-underline">
            <Card
              size="lg"
              className="group cursor-pointer border-green-300 bg-green-50 shadow-green-200 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-300 dark:border-green-700 dark:bg-green-950 dark:shadow-green-800 dark:hover:shadow-green-700"
            >
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-sm bg-green-500 text-2xl text-white">
                  🌱
                </div>
                <CardTitle className="text-xl text-green-800 dark:text-green-200">
                  Tinyfarm
                </CardTitle>
                <CardDescription className="text-green-700/70 dark:text-green-300/70">
                  {t('tinyfarm.card.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition-all group-hover:gap-2 dark:text-green-400">
                  {t('common.getHelp')} &rarr;
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Tinyverse card */}
          <Link href="/tinyverse" className="no-underline">
            <Card
              size="lg"
              className="group cursor-pointer border-purple-300 bg-purple-50 shadow-purple-200 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-300 dark:border-purple-700 dark:bg-purple-950 dark:shadow-purple-800 dark:hover:shadow-purple-700"
            >
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-sm bg-purple-500 text-2xl text-white">
                  🪐
                </div>
                <CardTitle className="text-xl text-purple-800 dark:text-purple-200">
                  Tinyverse
                </CardTitle>
                <CardDescription className="text-purple-700/70 dark:text-purple-300/70">
                  {t('tinyverse.card.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition-all group-hover:gap-2 dark:text-purple-400">
                  {t('common.getHelp')} &rarr;
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
