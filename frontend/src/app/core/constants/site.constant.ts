/**
 * URL de production du site, source unique de vérité pour le SEO.
 * Doit rester identique au domaine réellement déployé : un canonical pointant
 * vers un autre domaine transfère le référencement à ce domaine.
 * Si l'URL change (domaine personnalisé), mettre aussi à jour
 * `src/index.html`, `public/robots.txt` et `public/sitemap.xml`.
 */
export const SITE_URL = 'https://qrcraft-generation.netlify.app';
