"use client";

import { useEffect, useState } from "react";
import FlashButton from "./components/FlashButton";

const DEVICES = [
  { id: "tinyfarm-v1_0", label: "Tinyfarm 1.0" },
  { id: "tinyfarm-v1_5", label: "Tinyfarm 1.5" },
];

export default function FlashPage() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/manifest/${DEVICES[0].id}`)
      .then((r) => r.json())
      .then((data) => setVersion(data.version ?? null))
      .catch(() => setVersion(null));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Tinyfarm Firmware Flash
        </h1>
        <p className="mb-1 text-center text-sm text-gray-500">
          Flash the latest production firmware to your device
        </p>
        {version && (
          <p className="mb-6 text-center text-sm text-gray-400">
            Latest version: <span className="font-mono font-semibold">{version}</span>
          </p>
        )}

        {/* Flash buttons */}
        <div className="mb-6 flex gap-4">
          {DEVICES.map((device) => (
            <div key={device.id} className="flex-1">
              <FlashButton device={device.id} label={device.label} />
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-xs text-amber-700">
            <strong>Note:</strong> This will erase the device and flash fresh
            firmware. Your WiFi configuration will be reset. Connect your device
            via USB before clicking the flash button.
          </p>
        </div>
      </div>
    </main>
  );
}
