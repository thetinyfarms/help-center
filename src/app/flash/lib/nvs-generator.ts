/**
 * Generates a valid ESP-IDF NVS partition binary containing WiFi credentials
 * matching the ESP_WM_LITE_Configuration struct format used by the firmware.
 *
 * Uses the old/simple blob format (NVS_TYPE_BLOB = 0x41) which is what
 * Arduino's Preferences.putBytes() produces for blobs under 1984 bytes.
 *
 * NVS format: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/storage/nvs_flash.html
 */

// --- CRC32 (same polynomial as ESP-IDF: 0xEDB88320) ---

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  // ESP-IDF NVS calls esp_rom_crc32_le(0xFFFFFFFF, data, len).
  // That ROM function internally does: crc = ~init (=0), loop, return ~crc.
  // So the effective algorithm is: init=0, standard loop, invert output.
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc = crc32Table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (~crc) >>> 0;
}

// --- WiFi auth modes (matches wifi_auth_mode_t enum) ---

export const WIFI_AUTH_MODES = {
  WIFI_AUTH_OPEN: 0,
  WIFI_AUTH_WEP: 1,
  WIFI_AUTH_WPA_PSK: 2,
  WIFI_AUTH_WPA2_PSK: 3,
  WIFI_AUTH_WPA_WPA2_PSK: 4,
  WIFI_AUTH_WPA3_PSK: 6,
  WIFI_AUTH_WPA2_WPA3_PSK: 7,
} as const;

export type WifiAuthMode = (typeof WIFI_AUTH_MODES)[keyof typeof WIFI_AUTH_MODES];

// --- ESP_WM_LITE_Configuration struct builder ---

const SSID_MAX_LEN = 32;
const PASS_MAX_LEN = 64;
const HEADER_MAX_LEN = 16;
const BOARD_NAME_MAX_LEN = 24;
const CONFIG_SIZE = HEADER_MAX_LEN + (SSID_MAX_LEN + PASS_MAX_LEN + 4) * 2 + BOARD_NAME_MAX_LEN + 4; // 244

function writeString(buf: Uint8Array, offset: number, str: string, maxLen: number) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const len = Math.min(encoded.length, maxLen - 1);
  buf.set(encoded.subarray(0, len), offset);
  // Rest is already zeroed
}

function buildConfigStruct(
  ssid: string,
  password: string,
  authMode: WifiAuthMode
): Uint8Array {
  const buf = new Uint8Array(CONFIG_SIZE);
  const view = new DataView(buf.buffer);

  let offset = 0;

  // header[16] = "tinyfarms-esp"
  writeString(buf, offset, "tinyfarms-esp", HEADER_MAX_LEN);
  offset += HEADER_MAX_LEN;

  // WiFi_Creds[0] - user's WiFi
  writeString(buf, offset, ssid, SSID_MAX_LEN);
  offset += SSID_MAX_LEN;
  writeString(buf, offset, password, PASS_MAX_LEN);
  offset += PASS_MAX_LEN;
  view.setInt32(offset, authMode, true); // little-endian
  offset += 4;

  // WiFi_Creds[1] - placeholder (firmware overwrites with defaults)
  writeString(buf, offset, "mpty", SSID_MAX_LEN);
  offset += SSID_MAX_LEN;
  writeString(buf, offset, "mpty", PASS_MAX_LEN);
  offset += PASS_MAX_LEN;
  view.setInt32(offset, WIFI_AUTH_MODES.WIFI_AUTH_WPA2_PSK, true);
  offset += 4;

  // board_name[24] = "ESP32_Async-Control"
  writeString(buf, offset, "ESP32_Async-Control", BOARD_NAME_MAX_LEN);
  offset += BOARD_NAME_MAX_LEN;

  // checkSum - sum of all preceding bytes (matches firmware's calcChecksum())
  let checkSum = 0;
  for (let i = 0; i < offset; i++) {
    checkSum += buf[i];
  }
  view.setInt32(offset, checkSum | 0, true); // signed int32

  return buf;
}

// --- NVS partition format ---

const PAGE_SIZE = 4096;
const ENTRY_SIZE = 32;
const PAGE_HEADER_SIZE = 32;
const BITMAP_SIZE = 32;

// NVS types
const NS_TYPE = 0x01;
const BLOB_TYPE = 0x41; // Old/simple blob format (used by Preferences.putBytes for small blobs)

// Page states
const PAGE_ACTIVE = 0xfffffffe;

function markEntryBitmap(page: Uint8Array, entryIndex: number) {
  // Each entry uses 2 bits in bitmap. Written = 0b10, Empty = 0b11
  // Bitmap starts at offset 32 (after page header)
  const byteIndex = PAGE_HEADER_SIZE + Math.floor((entryIndex * 2) / 8);
  const bitOffset = (entryIndex * 2) % 8;
  // Clear the lower bit of the 2-bit pair to mark as "Written" (0b10)
  page[byteIndex] &= ~(1 << bitOffset);
}

/**
 * Write a single NVS entry header (32 bytes) to the page at the given entry index.
 */
function writeEntryHeader(
  page: Uint8Array,
  entryIndex: number,
  nsIndex: number,
  type: number,
  span: number,
  chunkIndex: number,
  key: string,
  data: Uint8Array
) {
  const offset = PAGE_HEADER_SIZE + BITMAP_SIZE + entryIndex * ENTRY_SIZE;
  const entry = new Uint8Array(ENTRY_SIZE);

  entry[0] = nsIndex;
  entry[1] = type;
  entry[2] = span;
  entry[3] = chunkIndex;
  // bytes 4-7: CRC32 (computed below)

  // key (bytes 8-23, 16 bytes, null-padded)
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key);
  entry.set(keyBytes.subarray(0, Math.min(keyBytes.length, 15)), 8);

  // data (bytes 24-31, 8 bytes)
  const dataLen = Math.min(data.length, 8);
  entry.set(data.subarray(0, dataLen), 24);

  // CRC32 over bytes 0-3 and 8-31, skipping bytes 4-7 (the CRC field itself).
  // ESP-IDF computes this as: crc32_le(crc32_le(0, &entry[0], 4), &entry[8], 24)
  // which is equivalent to CRC32 over the 28-byte concatenation [0..3] ++ [8..31].
  const crcInput = new Uint8Array(28);
  crcInput.set(entry.subarray(0, 4), 0);   // nsIndex, type, span, chunkIndex
  crcInput.set(entry.subarray(8, 32), 4);  // key + data
  const entryCrc = crc32(crcInput);
  new DataView(entry.buffer).setUint32(4, entryCrc, true);

  page.set(entry, offset);
}

function writePageHeader(page: Uint8Array, seqNo: number) {
  const view = new DataView(page.buffer, page.byteOffset);

  // Page state: ACTIVE
  view.setUint32(0, PAGE_ACTIVE, true);
  // Sequence number
  view.setUint32(4, seqNo, true);
  // NVS version: V2
  page[8] = 0xfe;
  // Bytes 9-27: unused (0xFF already from fill)

  // CRC32 of bytes 4-27
  const headerCrc = crc32(page.subarray(4, 28));
  view.setUint32(28, headerCrc, true);
}

/**
 * Add a blob to the NVS page using the old/simple blob format (type 0x41).
 * This is the format that Arduino Preferences.putBytes() uses for blobs <= 1984 bytes.
 *
 * Layout:
 *   Entry N (header): [nsIndex, type=0x41, span, 0xFF, CRC, key, size(u16), rsv(u16), dataCRC(u32)]
 *   Entries N+1..N+span-1: raw blob data (32 bytes per slot, last slot zero-padded)
 *
 * Returns the next free entry index.
 */
function addBlobToPage(
  page: Uint8Array,
  entryStart: number,
  nsIndex: number,
  key: string,
  blobData: Uint8Array
): number {
  const dataSpan = Math.ceil(blobData.length / ENTRY_SIZE);
  const totalSpan = 1 + dataSpan; // header entry + data entries

  // Build the 8-byte data portion of the header entry
  const headerData = new Uint8Array(8);
  const headerView = new DataView(headerData.buffer);
  headerView.setUint16(0, blobData.length, true); // blob size
  // bytes 2-3: reserved (0x0000)
  const dataCrc = crc32(blobData);
  headerView.setUint32(4, dataCrc, true); // CRC32 of blob data

  // Write the entry header
  writeEntryHeader(page, entryStart, nsIndex, BLOB_TYPE, totalSpan, 0xff, key, headerData);
  markEntryBitmap(page, entryStart);

  // Write raw blob data into subsequent entry slots
  const dataOffset = PAGE_HEADER_SIZE + BITMAP_SIZE + (entryStart + 1) * ENTRY_SIZE;
  page.set(blobData.subarray(0, Math.min(blobData.length, dataSpan * ENTRY_SIZE)), dataOffset);

  // Mark all data entry slots in bitmap
  for (let i = 0; i < dataSpan; i++) {
    markEntryBitmap(page, entryStart + 1 + i);
  }

  return entryStart + totalSpan;
}

/**
 * Generate a complete NVS partition binary with WiFi credentials.
 * Returns a Uint8Array that can be flashed to the nvs2 partition at 0x680000.
 */
export function generateNvsPartition(
  ssid: string,
  password: string,
  authMode: WifiAuthMode
): Uint8Array {
  // Build the config struct
  const configBlob = buildConfigStruct(ssid, password, authMode);

  // Create a minimal NVS partition (just one page of 4KB, rest erased)
  const NVS_PARTITION_SIZE = 0x80000; // 512KB to match partition table
  const partition = new Uint8Array(NVS_PARTITION_SIZE);
  partition.fill(0xff);

  const page = partition.subarray(0, PAGE_SIZE);

  // Initialize bitmap to all 0xFF (all entries empty)
  // Page header bytes 0-31 and bitmap bytes 32-63 are already 0xFF

  let entryIdx = 0;

  // Entry 0: Namespace "wifiman"
  const nsData = new Uint8Array(8);
  nsData[0] = 1; // assigned namespace index
  writeEntryHeader(page, entryIdx, 0, NS_TYPE, 1, 0xff, "wifiman", nsData);
  markEntryBitmap(page, entryIdx);
  entryIdx++;

  // Entries 1+: wm_config blob (old format, type 0x41)
  entryIdx = addBlobToPage(page, entryIdx, 1, "wm_config", configBlob);

  // Entries N+: wm_config_bp blob (backup, same format)
  entryIdx = addBlobToPage(page, entryIdx, 1, "wm_config_bp", configBlob);

  // Write page header (must be last since CRC covers header bytes)
  writePageHeader(page, 0);

  return partition;
}
