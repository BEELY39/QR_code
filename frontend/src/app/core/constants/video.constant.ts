/**
 * Vidéo de présentation du studio.
 *
 * Deux sources possibles. Pour en changer, il n'y a que `source` à modifier :
 * - `youtube` : rien n'est stocké dans le dépôt ni servi par Netlify, et
 *   l'iframe n'est chargée qu'au clic (domaine youtube-nocookie, donc aucun
 *   cookie Google tant que l'internaute ne lance pas la lecture) ;
 * - `file` : fichier déposé dans /public. Pratique en local, mais le binaire
 *   doit alors être versionné pour exister en production.
 */
export type VideoSource =
  | { readonly kind: 'youtube'; readonly videoId: string }
  | { readonly kind: 'file'; readonly src: string; readonly mimeType: string };

export interface PresentationVideo {
  readonly source: VideoSource;
  readonly width: number;
  readonly height: number;
  readonly durationSec: number;
  readonly title: string;
  readonly description: string;
  /** Date de mise en ligne au format ISO, pour le balisage VideoObject */
  readonly uploadDate: string;
  /** Image d'aperçu de repli, servie par le site */
  readonly fallbackThumbnail: string;
}

export const PRESENTATION_VIDEO: PresentationVideo = {
  // Identifiant YouTube (la partie après « v= » ou « youtu.be/ ») :
  // https://youtu.be/3tBFOwbNmxI
  // Vide, la section de démonstration ne s'affiche pas.
  // Pour tester en local avec le fichier du dossier public, remplacer par :
  //   { kind: 'file', src: '/qrcraft-presentation.mp4', mimeType: 'video/mp4' }
  source: { kind: 'youtube', videoId: '3tBFOwbNmxI' },
  width: 1920,
  height: 1080,
  durationSec: 65,
  title: 'QRCraft en 1 minute',
  description:
    "Démonstration du studio QRCraft : saisie d'un lien ou d'un réseau Wi-Fi, choix des couleurs et du cadre, incrustation d'un logo, puis export en SVG vectoriel ou en PDF prêt à imprimer.",
  uploadDate: '2026-10-01',
  fallbackThumbnail: '/og-image.jpg',
};

/** La section n'a de sens que si une source est réellement configurée */
export function hasVideoSource(video: PresentationVideo): boolean {
  return video.source.kind === 'youtube'
    ? video.source.videoId.trim().length > 0
    : video.source.src.trim().length > 0;
}

/** URL d'intégration, construite seulement au moment du clic */
export function buildEmbedUrl(source: VideoSource): string {
  if (source.kind !== 'youtube') {
    return '';
  }
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${source.videoId}?${params.toString()}`;
}

/** Page publique de la vidéo, utilisée par le balisage VideoObject */
export function buildWatchUrl(source: VideoSource, siteUrl: string): string {
  return source.kind === 'youtube'
    ? `https://www.youtube.com/watch?v=${source.videoId}`
    : `${siteUrl}${source.src}`;
}

/** Vignette : celle de YouTube si disponible, sinon l'image du site */
export function buildThumbnailUrl(video: PresentationVideo, siteUrl: string): string {
  return video.source.kind === 'youtube'
    ? `https://i.ytimg.com/vi/${video.source.videoId}/maxresdefault.jpg`
    : `${siteUrl}${video.fallbackThumbnail}`;
}

/** Durée au format ISO 8601 attendu par Schema.org (ex. PT1M5S) */
export function toIso8601Duration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `PT${minutes > 0 ? `${minutes}M` : ''}${seconds}S`;
}

/** Durée lisible en français (ex. « 1 min 05 ») */
export function toReadableDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes === 0) {
    return `${seconds} s`;
  }
  return `${minutes} min ${seconds.toString().padStart(2, '0')}`;
}
