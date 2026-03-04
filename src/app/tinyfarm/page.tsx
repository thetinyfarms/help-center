"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEVICES = [
  {
    id: "tinyfarm-v1_0",
    name: "Tinyfarm 1.0",
    badge: "Original",
    description:
      "The original Tinyfarm with core environmental monitoring — temperature, humidity, and CO\u2082 sensors for automated growing.",
  },
  {
    id: "tinyfarm-v1_5",
    name: "Tinyfarm 1.5",
    badge: "Latest",
    description:
      "Updated hardware with new fluid level sensors and an onboard LED status screen for at-a-glance device info.",
  },
];

export default function TinyfarmPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Back */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            &larr; Back to Help Center
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Which Tinyfarm do you have?</h1>
          <p className="mt-2 text-muted-foreground">
            Select your device version to get the right support
          </p>
        </div>

        {/* Device cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {DEVICES.map((device) => (
            <Card
              key={device.id}
              size="lg"
              className="flex flex-col border-green-300 bg-green-50 shadow-green-200 dark:border-green-700 dark:bg-green-950 dark:shadow-green-800"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-green-800 dark:text-green-200">
                    {device.name}
                  </CardTitle>
                  <Badge
                    variant={device.badge === "Latest" ? "default" : "secondary"}
                    className={
                      device.badge === "Latest"
                        ? "bg-green-600 text-white"
                        : "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
                    }
                  >
                    {device.badge}
                  </Badge>
                </div>
                <CardDescription className="text-green-700/70 dark:text-green-300/70">
                  {device.description}
                </CardDescription>
              </CardHeader>

              <div className="p-[var(--card-padding)] pt-0">
                <Link href={`/flash/${device.id}`}>
                  <Button
                    variant="success"
                    className="w-full cursor-pointer"
                  >
                    Flash Latest Firmware
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
