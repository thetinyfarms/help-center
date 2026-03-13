"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/lang/LanguageSelector";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
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
              // variant="muted"
              className="group cursor-pointer bg-green-50 border-green-100 shadow-green-100 shadow-none transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-200 hover:border-green-200 dark:border-green-700 dark:bg-green-950 dark:shadow-green-800 dark:hover:shadow-green-700"
            >
              <CardHeader>
                <img src="/assets/logos/logo-tinyfarm.svg" alt="tinyfarm logo" className="h-16 w-fit mb-3" />
                <CardDescription className="text-foreground">
                  {t('tinyfarm.card.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 -mt-2 items-start">
                <Button variant="link" size="sm" className="text-green-600 !no-underline group-hover:!underline pointer-events-none">
                  {t('common.getHelp')}
                  <ChevronRight className="opacity-secondary"/>
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Tinyverse card */}
          <Link href="/tinyverse" className="no-underline">
            <Card
              size="lg"
              variant="fill"
              className="group shadow-none transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-border hover:border-border"
            >
              <CardHeader>
                <img src="/assets/logos/logo-tinyverse.png" alt="tinyverse logo" className="h-16 w-fit mb-3" />
                <CardDescription>
                  {t('tinyverse.card.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 -mt-2 items-start">
                <Button variant="link" size="sm" className="!no-underline group-hover:!underline pointer-events-none">
                  {t('common.getHelp')}
                  <ChevronRight className="opacity-secondary"/>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
