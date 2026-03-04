"use client";

import { useState } from "react";
import { WIFI_AUTH_MODES, type WifiAuthMode } from "../lib/nvs-generator";

interface WifiConfigFormProps {
  onFlash: (ssid: string, password: string, authMode: WifiAuthMode) => void;
  isFlashing: boolean;
}

export default function WifiConfigForm({
  onFlash,
  isFlashing,
}: WifiConfigFormProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssid.trim()) return;
    onFlash(
      ssid.trim(),
      isOpen ? "" : password,
      isOpen ? WIFI_AUTH_MODES.WIFI_AUTH_OPEN : WIFI_AUTH_MODES.WIFI_AUTH_WPA2_PSK
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          WiFi Network Name
        </label>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          maxLength={31}
          placeholder="e.g. My Home Network"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          disabled={isFlashing}
          required
        />
      </div>

      {!isOpen && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={63}
              placeholder="Enter your WiFi password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              disabled={isFlashing}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={(e) => setIsOpen(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          disabled={isFlashing}
        />
        <span className="text-sm text-gray-600">
          No password (open network)
        </span>
      </label>

      <button
        type="submit"
        disabled={isFlashing || !ssid.trim() || (!isOpen && !password)}
        className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isFlashing ? "Writing WiFi credentials..." : "Write WiFi Credentials"}
      </button>
    </form>
  );
}
