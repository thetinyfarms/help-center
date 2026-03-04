"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">What do you need help with?</h1>
          <p className="mt-2 text-muted-foreground">
            Choose your product to get started
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
                  Hardware setup, firmware flashing, WiFi configuration, and troubleshooting for your Tinyfarm 1.0 &amp; 1.5 devices
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition-all group-hover:gap-2 dark:text-green-400">
                  Get help &rarr;
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
                  Dashboard navigation, experiment management, data visualization, and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition-all group-hover:gap-2 dark:text-purple-400">
                  Get help &rarr;
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
