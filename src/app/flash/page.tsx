"use client";

import { useEffect, useState } from "react";
import FlashButton from "./components/FlashButton";

const DEVICES = [
  { id: "tinyfarm-v1_0", label: "Tinyfarm 1.0" },
  { id: "tinyfarm-v1_5", label: "Tinyfarm 1.5" },
];

export default function FlashPage() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/manifest/${selectedDevice.id}`)
      .then((r) => r.json())
      .then((data) => setVersion(data.version ?? null))
      .catch(() => setVersion(null));
  }, [selectedDevice]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Tinyfarms Firmware Flash
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Flash the latest production firmware to your device
        </p>

        {/* Device selector */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select your device
          </label>
          <div className="flex gap-2">
            {DEVICES.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`flex-1 cursor-pointer rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  selectedDevice.id === device.id
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {device.label}
              </button>
            ))}
          </div>
        </div>

        {/* Version info */}
        {version && (
          <p className="mb-4 text-center text-sm text-gray-500">
            Latest version: <span className="font-mono font-semibold">{version}</span>
          </p>
        )}

        {/* Flash button */}
        <div className="mb-6">
          <FlashButton
            key={selectedDevice.id}
            device={selectedDevice.id}
            label={selectedDevice.label}
          />
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
