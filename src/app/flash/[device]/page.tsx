"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FlashButton from "../components/FlashButton";
import WifiProvisioner from "../components/WifiProvisioner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEVICE_INFO: Record<string, { label: string; description: string }> = {
  "tinyfarm-v1_0": {
    label: "Tinyfarm 1.0",
    description: "Original model with temperature, humidity, and CO\u2082 sensors",
  },
  "tinyfarm-v1_5": {
    label: "Tinyfarm 1.5",
    description: "Updated model with fluid sensors and LED status screen",
  },
};

export default function DeviceFlashPage() {
  const params = useParams<{ device: string }>();
  const device = params.device;
  const info = DEVICE_INFO[device];

  const [version, setVersion] = useState<string | null>(null);
  const [showWifi, setShowWifi] = useState(false);

  useEffect(() => {
    if (!device) return;
    fetch(`/api/manifest/${device}`)
      .then((r) => r.json())
      .then((data) => setVersion(data.version ?? null))
      .catch(() => setVersion(null));
  }, [device]);

  if (!info) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <Card size="lg" className="w-full max-w-lg text-center">
          <CardContent className="gap-4 py-8">
            <p className="text-lg font-semibold">Unknown device</p>
            <Link href="/tinyfarm">
              <Button variant="secondary">Back to device selection</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Back to device selection */}
        <Link href="/tinyfarm">
          <Button variant="ghost" size="sm" className="gap-1">
            &larr; Back to Tinyfarm
          </Button>
        </Link>

        {/* Firmware Flash Card */}
        <Card size="lg">
          <CardHeader className="items-center text-center">
            <CardTitle className="justify-center text-2xl">
              Flash {info.label}
            </CardTitle>
            <CardDescription>
              {info.description}
              {version && (
                <Badge variant="secondary" className="mx-auto mt-1">
                  v{version}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            <FlashButton device={device} label={info.label} />

            {/* Warning */}
            <div className="rounded-xs border border-sm border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                <strong>Note:</strong> This will erase the device and flash fresh
                firmware. Your WiFi configuration will be reset. Connect your
                device via USB before clicking the flash button.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* WiFi Configuration Toggle */}
        {!showWifi ? (
          <Button
            variant="ghost"
            onClick={() => setShowWifi(true)}
            className="w-full cursor-pointer rounded-md border-2 border-dashed border-muted-foreground/30 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            + Add WiFi Configuration
          </Button>
        ) : (
          <Card size="lg">
            <CardContent>
              <WifiProvisioner />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
