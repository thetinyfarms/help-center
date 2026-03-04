"use client";

import { useState } from "react";
import { generateNvsPartition, type WifiAuthMode } from "../lib/nvs-generator";
import WifiConfigForm from "./WifiConfigForm";

const NVS2_OFFSET = 0x680000;
const BAUD_RATE = 460800;
const ESP32_S3_FILTERS = [{ usbVendorId: 0x303a }];

export default function WifiProvisioner() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFlash = async (
    ssid: string,
    password: string,
    authMode: WifiAuthMode
  ) => {
    setIsFlashing(true);
    setStatus(null);

    try {
      // Dynamic import to avoid SSR issues
      const { ESPLoader, Transport } = await import("esptool-js");

      // Request serial port
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const port = await (navigator as any).serial.requestPort({
        filters: ESP32_S3_FILTERS,
      });

      const transport = new Transport(port, true);
      const esploader = new ESPLoader({
        transport,
        baudrate: BAUD_RATE,
        romBaudrate: 115200,
      });

      setStatus({ type: "success", message: "Connecting to device..." });
      await esploader.main();

      // Generate NVS partition with WiFi credentials
      setStatus({
        type: "success",
        message: "Writing WiFi credentials to device...",
      });
      const nvsPartition = generateNvsPartition(ssid, password, authMode);

      // Convert to binary string for esptool-js
      const binaryString = Array.from(nvsPartition)
        .map((b) => String.fromCharCode(b))
        .join("");

      // Flash NVS partition (no full erase - only write the nvs2 partition)
      await esploader.writeFlash({
        fileArray: [{ data: binaryString, address: NVS2_OFFSET }],
        flashSize: "keep",
        flashMode: "keep",
        flashFreq: "keep",
        eraseAll: false,
        compress: true,
      });

      // Reset device
      await transport.setDTR(false);
      await transport.setRTS(true);
      await new Promise((r) => setTimeout(r, 100));
      await transport.setRTS(false);

      await transport.disconnect();

      setStatus({
        type: "success",
        message: `WiFi credentials written! The device will connect to "${ssid}" on next boot.`,
      });
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotFoundError"
          ? "No device selected."
          : err instanceof Error
            ? err.message
            : "Unknown error";
      setStatus({ type: "error", message });
    } finally {
      setIsFlashing(false);
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-gray-900">
        WiFi Configuration
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Write WiFi credentials directly to the device so it connects
        automatically on boot.
      </p>

      <WifiConfigForm onFlash={handleFlash} isFlashing={isFlashing} />

      {status && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
