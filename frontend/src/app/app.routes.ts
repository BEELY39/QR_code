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
    path: 'qr-code-svg',
    loadComponent: () =>
      import('./features/use-cases/qr-code-svg/qr-code-svg.component').then(m => m.QrCodeSvgComponent),
    title: 'Générateur de QR code SVG gratuit — vectoriel pour l\'impression | QRCraft'
  },
  {
    path: 'qr-code-statique-vs-dynamique',
    loadComponent: () =>
      import('./features/use-cases/qr-code-statique-dynamique/qr-code-statique-dynamique.component')
        .then(m => m.QrCodeStatiqueDynamiqueComponent),
    title: 'QR code statique ou dynamique : lequel choisir ? | QRCraft'
  },
  {
    path: 'confidentialite',
    loadComponent: () =>
      import('./features/legal/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Confidentialité — vos données ne quittent pas votre navigateur | QRCraft'
  },
  {
    // Une URL inconnue doit afficher une 404, pas dupliquer l'accueil en 200.
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page introuvable (404) — QRCraft'
  }
];
