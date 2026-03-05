"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import FlashButton from "../components/FlashButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/lang/LanguageSelector";

const DEVICE_INFO: Record<string, { labelKey: string; descKey: string }> = {
  "tinyfarm-v1_0": {
    labelKey: "devices.v1_0.name",
    descKey: "devices.v1_0.description",
  },
  "tinyfarm-v1_5": {
    labelKey: "devices.v1_5.name",
    descKey: "devices.v1_5.description",
  },
};

export default function DeviceFlashPage() {
  const params = useParams<{ device: string }>();
  const device = params.device;
  const info = DEVICE_INFO[device];
  const t = useTranslations();

  const [version, setVersion] = useState<string | null>(null);
  const [showWifi, setShowWifi] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isOpenNetwork, setIsOpenNetwork] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
              <Button variant="secondary">{t("nav.backToTinyfarm")}</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const label = t(info.labelKey);

  const wifiConfig =
    showWifi && ssid.trim()
      ? {
          ssid: ssid.trim(),
          password: isOpenNetwork ? "" : password,
          open: isOpenNetwork,
        }
      : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/tinyfarm">
            <Button variant="ghost" size="sm" className="gap-1">
              &larr; {t("nav.backToTinyfarm")}
            </Button>
          </Link>
          <LanguageSelector variant="ghost" size="sm" subtle dropdownAlign="end" />
        </div>

        <Card size="lg">
          <CardHeader className="items-center text-center">
            <CardTitle className="justify-center text-2xl">
              {t("flash.title", { device: label })}
            </CardTitle>
            <CardDescription>
              {t("flash.subtitle")}
              {version && (
                <Badge variant="secondary" className="mx-auto mt-1">
                  v{version}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            {/* Optional WiFi — collapsed toggle or expanded form */}
            {!showWifi ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWifi(true)}
              >
                {t("flash.addWifi")}
              </Button>
            ) : (
              <div className="space-y-3 rounded-xs border border-sm border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {t("flash.wifi.title")}
                  </p>
                  <button
                    onClick={() => {
                      setShowWifi(false);
                      setSsid("");
                      setPassword("");
                      setIsOpenNetwork(false);
                    }}
                    className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    {t("flash.wifi.ssidLabel")}
                  </label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    maxLength={31}
                    placeholder={t("flash.wifi.ssidPlaceholder")}
                    className="w-full rounded-sm border border-md bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-success focus:ring-1 focus:ring-success focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("flash.wifi.ssidHint")}
                  </p>
                </div>

                {!isOpenNetwork && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      {t("flash.wifi.passwordLabel")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={63}
                        placeholder={t("flash.wifi.passwordPlaceholder")}
                        className="w-full rounded-sm border border-md bg-background px-3 py-2 pr-16 text-sm text-foreground placeholder-muted-foreground focus:border-success focus:ring-1 focus:ring-success focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? t("flash.wifi.hide")
                          : t("flash.wifi.show")}
                      </button>
                    </div>
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isOpenNetwork}
                    onChange={(e) => setIsOpenNetwork(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-success accent-success"
                  />
                  <span className="text-sm text-muted-foreground">
                    {t("flash.wifi.openNetwork")}
                  </span>
                </label>
              </div>
            )}

            {/* Single flash button */}
            <FlashButton device={device} label={label} wifi={wifiConfig} />

            {/* Warning */}
            <div className="rounded-xs border border-sm border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                <strong>{t("common.note")}:</strong> {t("flash.warning")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
