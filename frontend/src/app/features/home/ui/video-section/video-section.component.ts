import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  PRESENTATION_VIDEO,
  buildEmbedUrl,
  hasVideoSource,
  toReadableDuration,
} from '../../../../core/constants/video.constant';

/**
 * Section de démonstration vidéo.
 *
 * Rien n'est chargé avant le clic : l'internaute ne voit qu'une vignette en
 * HTML/CSS. L'iframe YouTube (ou la balise <video>) n'est créée qu'ensuite —
 * ce qui évite à la fois le poids réseau et, côté YouTube, tout dépôt de
 * cookie sur une page que la plupart des visiteurs ne regarderont pas.
 */
@Component({
  selector: 'app-video-section',
  standalone: true,
  imports: [],
  templateUrl: './video-section.component.html',
})
export class VideoSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly video = PRESENTATION_VIDEO;
  protected readonly duration = toReadableDuration(PRESENTATION_VIDEO.durationSec);

  /** Masque toute la section tant qu'aucune source n'est configurée */
  protected readonly isConfigured = hasVideoSource(PRESENTATION_VIDEO);

  /** Passe à vrai au premier clic : c'est ce qui déclenche le chargement */
  readonly isStarted = signal(false);

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    if (!this.isStarted() || this.video.source.kind !== 'youtube') {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(buildEmbedUrl(this.video.source));
  });

  protected readonly fileSource = computed(() =>
    this.video.source.kind === 'file' ? this.video.source : null
  );

  start(): void {
    this.isStarted.set(true);
  }
}
export { VideoSectionComponent as VideoSection };
