import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Espace connecté : dépend de la session, jamais prérendu (rendu dans le navigateur).
    path: 'app',
    renderMode: RenderMode.Client
  },
  {
    path: 'app/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
