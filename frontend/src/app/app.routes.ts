import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LegalNoticeComponent } from './features/legal/legal-notice.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'mentions-legales',
    component: LegalNoticeComponent,
    title: 'Mentions légales — QRCraft'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
