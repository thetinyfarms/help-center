"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  generateNvsPartition,
  WIFI_AUTH_MODES,
} from "../lib/nvs-generator";

interface WifiConfig {
  ssid: string;
  password: string;
  open: boolean;
}

interface FlashButtonProps {
  device: string;
  label: string;
  wifi?: WifiConfig;
}

export default function FlashButton({ device, label, wifi }: FlashButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/esp-web-tools@10.1.1/dist/web/install-button.js?module";
    document.head.appendChild(script);


    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Build a manifest URL — either the default API one, or a blob URL
  // that includes an extra NVS part for WiFi credentials.
  const buildManifestUrl = useCallback(async (): Promise<string> => {
    const apiUrl = `/api/manifest/${device}`;

    if (!wifi || !wifi.ssid) return apiUrl;

    // Fetch the base manifest
    const res = await fetch(apiUrl);
    const manifest = await res.json();

    // Generate NVS binary with WiFi credentials
    const authMode = wifi.open
      ? WIFI_AUTH_MODES.WIFI_AUTH_OPEN
      : WIFI_AUTH_MODES.WIFI_AUTH_WPA2_PSK;
    const nvsPartition = generateNvsPartition(wifi.ssid, wifi.password, authMode);

    // Create a blob URL for the NVS binary
    const nvsBlob = new Blob([nvsPartition.buffer as ArrayBuffer], {
      type: "application/octet-stream",
    });
    const nvsBlobUrl = URL.createObjectURL(nvsBlob);

    // Add NVS part to the manifest
    if (manifest.builds?.[0]?.parts) {
      manifest.builds[0].parts.push({
        path: nvsBlobUrl,
        offset: 0x680000,
      });
    }

    // Create a blob URL for the modified manifest
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const manifestBlob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    const manifestBlobUrl = URL.createObjectURL(manifestBlob);
    blobUrlRef.current = manifestBlobUrl;

    return manifestBlobUrl;
  }, [device, wifi]);

  // Update the manifest attribute on the web component whenever wifi changes
  useEffect(() => {
    const button = containerRef.current?.querySelector(
      "esp-web-install-button"
    );
    if (!button) return;

    buildManifestUrl().then((url) => {
      button.setAttribute("manifest", url);
    });

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [buildManifestUrl]);

  const defaultManifestUrl = `/api/manifest/${device}`;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 [&_esp-web-install-button]:w-full">
      <esp-web-install-button
        manifest={defaultManifestUrl}
        erase-first={true}
        disable-improv={true}
      >
        <Button
          slot="activate"
          variant="success"
          size="default"
          className="w-full cursor-pointer py-5 text-lg"
        >
          {t("flash.flashButton", { label })}
        </Button>
        <span slot="unsupported">
          <p className="rounded-xs border border-sm border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {t("flash.unsupported")}
          </p>
        </span>
        <span slot="not-allowed">
          <p className="rounded-xs border border-sm border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            {t("flash.notAllowed")}
          </p>
        </span>
      </esp-web-install-button>
    </div>
  );
}
