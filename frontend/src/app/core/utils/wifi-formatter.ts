import { WifiConfig, WifiEncryption } from '../models/live-qr.model';

/**
 * Nettoie et échappe les caractères spéciaux pour le format standard WIFI des QR Codes (ZXing / iOS / Android).
 * Caractères spéciaux réservés dans la syntaxe MECARD/ZXing : \ ; , : "
 * Tout caractère spécial doit être préfixé d'un antislash (\).
 * Les sauts de ligne (\r, \n) sont systématiquement purgés pour ne pas corrompre la trame.
 */
export function escapeWifiString(str: string): string {
  if (!str) {
    return '';
  }
  const sanitized = str.replace(/[\r\n]+/g, '');
  return sanitized.replace(/[\\;,:"]/g, (char) => `\\${char}`);
}

/**
 * Formate un objet WifiConfig en une chaîne standard WIFI: pour QR Code.
 * Conforme au standard ZXing supporté nativement par iOS (Appareil Photo Apple) et Android (Google Lens / Samsung Camera).
 *
 * Spécifications de la syntaxe :
 * - WPA / WPA2 / WPA3 : WIFI:S:NomDuReseau;T:WPA;P:MotDePasse;;
 * - WEP  : WIFI:S:NomDuReseau;T:WEP;P:MotDePasse;;
 * - Réseau ouvert : WIFI:S:NomDuReseau;T:nopass;;
 * - Réseau masqué : WIFI:S:NomDuReseau;T:WPA;P:MotDePasse;H:true;;
 *
 * NOTE CRITIQUE DE COMPATIBILITÉ (iOS, Android & Box internet) :
 * 1. Le SSID (S:) placé en première position assure la détection immédiate du réseau.
 * 2. Les seules valeurs de T: reconnues sont WPA, WEP, nopass (et SAE pour du WPA3 strict).
 *    'WPA' couvre WPA, WPA2 et WPA3 : c'est la valeur attendue par l'appareil photo iOS
 *    et par Android. Un T:WPA2 non standard peut être ignoré ou refusé au moment de
 *    rejoindre le réseau — l'option « WPA2 / WPA3 » de l'interface est donc encodée en WPA.
 * 3. Le paramètre H: ne doit être présent QUE si hidden === true ('H:true;').
 */
const ENCRYPTION_TOKEN: Record<WifiEncryption, string> = {
  WPA2: 'WPA',
  WPA: 'WPA',
  WEP: 'WEP',
  nopass: 'nopass',
};

export function formatWifiPayload(config: WifiConfig): string {
  const enc: WifiEncryption = config.encryption || 'WPA2';
  const type = ENCRYPTION_TOKEN[enc] ?? 'WPA';
  const ssid = escapeWifiString(config.ssid || '');
  const pass = config.password ? escapeWifiString(config.password) : '';

  let payload = `WIFI:S:${ssid};T:${type};`;

  if (enc !== 'nopass' && pass.length > 0) {
    payload += `P:${pass};`;
  }

  // Seul un réseau explicitement masqué doit inclure H:true;
  if (config.hidden) {
    payload += 'H:true;';
  }

  payload += ';';

  return payload;
}

