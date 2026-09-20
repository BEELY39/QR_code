import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlternativeCompetitor } from '../../../../core/models/alternative.model';
import { MARKET_ALTERNATIVES } from '../../../../core/constants/alternatives.constant';

@Component({
  selector: 'app-alternatives-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alternatives-section.component.html',
  styleUrl: './alternatives-section.component.scss',
})
export class AlternativesSectionComponent {
  /** Liste des alternatives concurrentes analysées */
  readonly alternatives = signal<readonly AlternativeCompetitor[]>(MARKET_ALTERNATIVES);

  /** Référence vers le conteneur défilable pour la navigation programmatique */
  readonly carouselTrack = viewChild<ElementRef<HTMLElement>>('carouselTrack');

  /** Fait défiler le carrousel vers la gauche */
  scrollLeft(): void {
    const track = this.carouselTrack()?.nativeElement;
    if (track && typeof track.scrollBy === 'function') {
      track.scrollBy({ left: -360, behavior: 'smooth' });
    }
  }

  /** Fait défiler le carrousel vers la droite */
  scrollRight(): void {
    const track = this.carouselTrack()?.nativeElement;
    if (track && typeof track.scrollBy === 'function') {
      track.scrollBy({ left: 360, behavior: 'smooth' });
    }
  }
}

export { AlternativesSectionComponent as AlternativesSection };
