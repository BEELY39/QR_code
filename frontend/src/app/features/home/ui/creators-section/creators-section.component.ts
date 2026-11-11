import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { SparklineComponent } from '../../../../shared/ui/sparkline/sparkline.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { KpiTileComponent } from '../../../../shared/ui/kpi-tile/kpi-tile.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { SAMPLE_CREATOR_HIGHLIGHT } from '../../../../core/constants/sample-stats.constant';
import {
  PRESENTATION_VIDEO,
  buildEmbedUrl,
  hasVideoSource,
  toReadableDuration,
} from '../../../../core/constants/video.constant';
import { SampleCreatorHighlight } from '../../../../core/models/sample-stats.model';

/**
 * Bloc créateurs. Il accueille le lecteur de démonstration : rien n'est chargé
 * avant le clic (aucune requête YouTube ni cookie au chargement de la page).
 */
@Component({
  selector: 'app-creators-section',
  standalone: true,
  imports: [ButtonDirective, IconComponent, SparklineComponent, BadgeComponent, KpiTileComponent],
  templateUrl: './creators-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorsSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly content = input<(typeof LANDING_CONTENT)['creators']>(LANDING_CONTENT.creators);
  readonly highlight = input<SampleCreatorHighlight>(SAMPLE_CREATOR_HIGHLIGHT);

  protected readonly video = PRESENTATION_VIDEO;
  protected readonly duration = toReadableDuration(PRESENTATION_VIDEO.durationSec);

  /** Masque le lecteur tant qu'aucune source n'est configurée. */
  protected readonly isConfigured = hasVideoSource(PRESENTATION_VIDEO);

  /** Passe à vrai au premier clic : c'est ce qui déclenche le chargement. */
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
