import { WifiConfig } from '../models/live-qr.model';

/**
 * Escape special characters for Wi-Fi QR Code string format.
 * Special characters: \ ; , : "
 * Must be escaped with a backslash.
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

/**
 * Format a WifiConfig object into a standard WIFI string for QR Codes.
 * Format: WIFI:T:WPA;S:SSID;P:PASSWORD;H:true;;
 */
export function formatWifiPayload(config: WifiConfig): string {
  const enc = config.encryption;
  const ssid = escapeWifiString(config.ssid);
  // Passwords are not always provided, especially for 'nopass'
  const pass = config.password ? escapeWifiString(config.password) : '';
  const hidden = config.hidden ? 'true' : 'false';

  // WEP/WPA need password, nopass doesn't.
  // The format generally includes P: even if empty, but for nopass it's better to omit P: entirely or leave it empty.
  // Standard format allows skipping P: for nopass.
  let payload = `WIFI:T:${enc};S:${ssid};`;
  
  if (enc !== 'nopass' && pass) {
    payload += `P:${pass};`;
  }
  
  payload += `H:${hidden};;`;
  
  return payload;
}
