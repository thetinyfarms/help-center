"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface FlashButtonProps {
  device: string;
  label: string;
}

export default function FlashButton({ device, label }: FlashButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const manifestUrl = `/api/manifest/${device}`;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3">
      <esp-web-install-button
        manifest={manifestUrl}
        erase-first={true}
        disable-improv={true}
      >
        <Button
          slot="activate"
          variant="success"
          size="default"
          className="w-full cursor-pointer px-8 py-4 text-lg"
        >
          Flash {label}
        </Button>
        <span slot="unsupported">
          <p className="rounded-xs border border-sm border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            Your browser does not support Web Serial. Please use{" "}
            <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
          </p>
        </span>
        <span slot="not-allowed">
          <p className="rounded-xs border border-sm border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            Web Serial is not allowed in this context. Make sure you&apos;re
            accessing this page over HTTPS.
          </p>
        </span>
      </esp-web-install-button>
    </div>
  );
}
