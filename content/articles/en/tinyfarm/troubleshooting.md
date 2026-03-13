---
title: "Troubleshooting"
category: "tinyfarm"
order: 5
---

# Troubleshooting

Common issues and how to fix them.

## Device not showing in Tinyverse

1. Check that the device is powered on (USB-C connected)
2. Verify WiFi credentials are correct — re-flash if needed
3. Make sure you're using a 2.4 GHz WiFi network
4. Check that your router isn't blocking new devices

## Sensor readings look wrong

- **Temperature spikes**: Ensure the device isn't in direct sunlight or near a heat source
- **Humidity stuck at 0 or 100**: Check that the sensor is not wet or obstructed
- **CO₂ readings erratic**: Allow 24 hours for the sensor to calibrate after first power-on

## Flash button not working

- Use **Google Chrome** or **Microsoft Edge** — other browsers don't support Web Serial
- Make sure you're on HTTPS (not HTTP)
- Try a different USB cable — some cables are charge-only and don't support data
- On Windows, you may need to install [USB drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)

## Device keeps disconnecting

- Move the device closer to your WiFi router
- Check for interference from other 2.4 GHz devices (microwaves, baby monitors)
- Try assigning a static IP in your router settings
- Re-flash with the latest firmware which includes connectivity improvements
