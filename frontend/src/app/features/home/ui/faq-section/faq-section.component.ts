import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaqItem } from '../../../../core/models/faq.model';
import { LANDING_FAQ_IDS, selectFaqItems } from '../../../../core/constants/faq.constant';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

/** Accordéon de la landing : 6 questions, 4 visibles en mobile (FR-029). */
@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './faq-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  /** Questions affichées, dans l'ordre de la maquette. */
  readonly faqs = signal<readonly FaqItem[]>(selectFaqItems(LANDING_FAQ_IDS));

  /** Nombre de questions visibles en mobile. */
  readonly mobileCount = 4;

  readonly content = LANDING_CONTENT.faq;

  /** Identifiant de la question actuellement dépliée (la première par défaut) */
  readonly openFaqId = signal<string | null>('faq-free');

  /** Bascule l'état ouvert/fermé d'un accordéon */
  toggleFaq(id: string): void {
    this.openFaqId.update((current) => (current === id ? null : id));
  }

  /** Indique si un accordéon donné est ouvert */
  isOpen(id: string): boolean {
    return this.openFaqId() === id;
  }
}

export { FaqSectionComponent as FaqSection };
