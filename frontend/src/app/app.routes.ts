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
    path: '**',
    redirectTo: ''
  }
];
