import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LegalNoticeComponent } from './features/legal/legal-notice.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: 'QRCraft — Générateur de QR Code Personnalisé Gratuit en Ligne'
  },
  {
    path: 'mentions-legales',
    component: LegalNoticeComponent,
    title: 'Mentions légales — QRCraft'
  },
  {
    path: 'articles',
    loadComponent: () => import('./features/articles/articles.component').then(m => m.ArticlesComponent),
    title: 'Articles & Guides Pratiques QR Code — QRCraft'
  },
  {
    path: 'qr-code-wifi',
    loadComponent: () =>
      import('./features/use-cases/qr-code-wifi/qr-code-wifi.component').then(m => m.QrCodeWifiComponent),
    title: 'Générateur de QR code Wi-Fi gratuit — connexion sans mot de passe | QRCraft'
  },
  {
    // Une URL inconnue doit afficher une 404, pas dupliquer l'accueil en 200.
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page introuvable (404) — QRCraft'
  }
];
