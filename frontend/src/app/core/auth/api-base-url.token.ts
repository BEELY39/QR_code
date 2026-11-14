import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Racine de l'API QRCraft (`http://localhost:8081` en dev, `https://api.qrcode-craft.fr` en prod). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
