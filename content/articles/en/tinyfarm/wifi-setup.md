---
title: "WiFi Setup"
category: "tinyfarm"
order: 2
---

# WiFi Setup

Your Tinyfarm needs a WiFi connection to send data to Tinyverse.

## Configuring WiFi during flashing

The easiest way to set up WiFi is during firmware flashing:

1. Go to the [firmware flash page](/tinyfarm) and select your device
2. Click **+ Add WiFi Configuration** below the flash button
3. Enter your WiFi network name (SSID) and password
4. Flash the firmware — WiFi credentials will be included automatically

## Troubleshooting

### Device not connecting to WiFi
- Make sure you're using a **2.4 GHz** network (5 GHz is not supported)
- Double-check the SSID and password — they are case-sensitive
- Move the device closer to your router during initial setup

### Device was connected but lost connection
- Check that your router is online
- Try power-cycling the Tinyfarm by unplugging and re-plugging USB
- If the problem persists, re-flash the firmware with fresh WiFi credentials
