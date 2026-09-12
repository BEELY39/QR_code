import { Component, inject } from '@angular/core';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { HeroSectionComponent } from './ui/hero-section/hero-section.component';
import { SimulatorSectionComponent } from './ui/simulator-section/simulator-section.component';
import { FeaturesSectionComponent } from './ui/features-section/features-section.component';
import { ShowcaseSectionComponent } from './ui/showcase-section/showcase-section.component';
import { CtaBannerComponent } from './ui/cta-banner/cta-banner.component';
import { FooterComponent } from './ui/footer/footer.component';
import { QrSimulatorService } from './data-access/qr-simulator.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    SimulatorSectionComponent,
    FeaturesSectionComponent,
    ShowcaseSectionComponent,
    CtaBannerComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly simulatorService = inject(QrSimulatorService);
}
export { HomeComponent as Home };
