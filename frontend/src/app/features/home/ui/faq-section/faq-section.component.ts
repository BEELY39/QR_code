import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaqItem } from '../../../../core/models/faq.model';
import { FAQ_ITEMS } from '../../../../core/constants/faq.constant';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent {
  /** Liste des questions/réponses de la FAQ */
  readonly faqs = signal<readonly FaqItem[]>(FAQ_ITEMS);

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
