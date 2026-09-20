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
 * - WPA / WPA2 / WPA3 : WIFI:T:WPA;S:NomDuReseau;P:MotDePasse;;
 * - Réseau sans mot de passe : WIFI:T:nopass;S:NomDuReseau;;
 * - Réseau masqué : WIFI:T:WPA;S:NomDuReseau;P:MotDePasse;H:true;;
 *
 * NOTE CRITIQUE DE COMPATIBILITÉ (iOS & Android) :
 * Le paramètre H: ne doit être présent QUE si hidden === true ('H:true;').
 * Ajouter 'H:false;' casse la détection et la tentative de connexion automatique
 * sur l'application Appareil Photo d'iOS (qui échoue avec "Impossible de rejoindre le réseau"
 * ou tente une association active vers un SSID masqué) ainsi que sur certains terminaux Android.
 */
export function formatWifiPayload(config: WifiConfig): string {
  const enc: WifiEncryption = config.encryption || 'WPA';
  const ssid = escapeWifiString(config.ssid || '');
  const pass = config.password ? escapeWifiString(config.password) : '';

  let payload = `WIFI:T:${enc};S:${ssid};`;

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

