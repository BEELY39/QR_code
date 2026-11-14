import { Component, inject } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/layout/site-header/site-header.component';
import { HeroSectionComponent } from './ui/hero-section/hero-section.component';
import { UseCasesStripComponent } from './ui/use-cases-strip/use-cases-strip.component';
import { StaticVsDynamicComponent } from './ui/static-vs-dynamic/static-vs-dynamic.component';
import { ModelSectionComponent } from './ui/model-section/model-section.component';
import { TrackerSectionComponent } from './ui/tracker-section/tracker-section.component';
import { AdvertisersSectionComponent } from './ui/advertisers-section/advertisers-section.component';
import { CreatorsSectionComponent } from './ui/creators-section/creators-section.component';
import { SimulatorSectionComponent } from './ui/simulator-section/simulator-section.component';
import { PrivacyNoteComponent } from './ui/privacy-note/privacy-note.component';
import { FaqSectionComponent } from './ui/faq-section/faq-section.component';
import { CtaBannerComponent } from './ui/cta-banner/cta-banner.component';
import { FooterComponent } from './ui/footer/footer.component';
import { QrSimulatorService } from './data-access/qr-simulator.service';
import { SeoService } from '../../core/services/seo.service';
import { SITE_URL } from '../../core/constants/site.constant';
import { PRESENTATION_VIDEO } from '../../core/constants/video.constant';
import { LANDING_FAQ_IDS, selectFaqItems } from '../../core/constants/faq.constant';

/**
 * Smart component de la landing : compose les 14 blocs et porte les
 * métadonnées SEO. Aucun texte éditorial ici (FR-018).
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    HeroSectionComponent,
    UseCasesStripComponent,
    StaticVsDynamicComponent,
    ModelSectionComponent,
    TrackerSectionComponent,
    AdvertisersSectionComponent,
    CreatorsSectionComponent,
    SimulatorSectionComponent,
    PrivacyNoteComponent,
    FaqSectionComponent,
    CtaBannerComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly simulatorService = inject(QrSimulatorService);

  constructor() {
    const seo = inject(SeoService);
    // Réaffirme l'URL canonique du site déployé (voir SITE_URL).
    seo.updateCanonical(`${SITE_URL}/`);
    // Déclare la vidéo de démonstration aux moteurs (extrait vidéo possible).
    seo.updateVideoSchema(PRESENTATION_VIDEO, SITE_URL);
    // Le schéma FAQ ne décrit que les questions réellement affichées (FR-038).
    seo.updateFaqSchema(selectFaqItems(LANDING_FAQ_IDS));
  }
}
export { HomeComponent as Home };
