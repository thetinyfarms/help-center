"use client";

import { useEffect, useState } from "react";
import FlashButton from "./components/FlashButton";
import WifiProvisioner from "./components/WifiProvisioner";

const DEVICES = [
  { id: "tinyfarm-v1_0", label: "Tinyfarm 1.0" },
  { id: "tinyfarm-v1_5", label: "Tinyfarm 1.5" },
];

export default function FlashPage() {
  const [version, setVersion] = useState<string | null>(null);
  const [showWifi, setShowWifi] = useState(false);

  useEffect(() => {
    fetch(`/api/manifest/${DEVICES[0].id}`)
      .then((r) => r.json())
      .then((data) => setVersion(data.version ?? null))
      .catch(() => setVersion(null));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Firmware Flash Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Tinyfarm Firmware Flash
          </h1>
          <p className="mb-1 text-center text-sm text-gray-500">
            Flash the latest production firmware to your device
          </p>
          {version && (
            <p className="mb-6 text-center text-sm text-gray-400">
              Latest version:{" "}
              <span className="font-mono font-semibold">{version}</span>
            </p>
          )}

          <div className="mb-6 flex gap-4">
            {DEVICES.map((device) => (
              <div key={device.id} className="flex-1">
                <FlashButton device={device.id} label={device.label} />
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-xs text-amber-700">
              <strong>Note:</strong> This will erase the device and flash fresh
              firmware. Your WiFi configuration will be reset. Connect your
              device via USB before clicking the flash button.
            </p>
          </div>
        </div>

        {/* WiFi Configuration Toggle */}
        {!showWifi ? (
          <button
            onClick={() => setShowWifi(true)}
            className="w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
          >
            + Add WiFi Configuration
          </button>
        ) : (
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <WifiProvisioner />
          </div>
        )}
      </div>
    </main>
  );
}
