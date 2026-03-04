"use client";

import { useEffect, useRef } from "react";

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
        <button
          slot="activate"
          className="cursor-pointer rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-700"
        >
          Flash {label}
        </button>
        <span slot="unsupported">
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Your browser does not support Web Serial. Please use{" "}
            <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
          </p>
        </span>
        <span slot="not-allowed">
          <p className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
            Web Serial is not allowed in this context. Make sure you&apos;re
            accessing this page over HTTPS.
          </p>
        </span>
      </esp-web-install-button>
    </div>
  );
}
