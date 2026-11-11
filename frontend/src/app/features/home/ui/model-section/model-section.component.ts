import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagChipComponent } from '../../../../shared/ui/tag-chip/tag-chip.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import {
  ModelExample,
  ModelStep,
  SectionHeading,
} from '../../../../core/models/landing-content.model';

/** Organisation Compte › Campagnes › QR codes (maquette Main, bloc MODEL). */
@Component({
  selector: 'app-model-section',
  standalone: true,
  imports: [TagChipComponent, IconComponent],
  templateUrl: './model-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelSectionComponent {
  readonly heading = input<SectionHeading>(LANDING_CONTENT.model);
  readonly steps = input<readonly ModelStep[]>(LANDING_CONTENT.modelSteps);
  readonly stepsMobile = input<readonly string[]>(LANDING_CONTENT.modelStepsMobile);
  readonly examples = input<readonly ModelExample[]>(LANDING_CONTENT.modelExamples);
}
