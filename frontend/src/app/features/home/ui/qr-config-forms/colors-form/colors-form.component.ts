import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { QrColorConfig, QrDesignOptions, GradientType } from '../../../../../core/models/live-qr.model';

export interface BrandColorSwatch {
  readonly name: string;
  readonly hex: string;
}

@Component({
  selector: 'app-colors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './colors-form.component.html',
  styleUrls: ['./colors-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialConfig = input.required<QrDesignOptions>();
  readonly configChange = output<Partial<QrDesignOptions>>();

  readonly brandSwatches: readonly BrandColorSwatch[] = [
    { name: 'Noir Absolu', hex: '#000000' },
    { name: 'Violet Studio', hex: '#6750A4' },
    { name: 'Indigo Profond', hex: '#3F51B5' },
    { name: 'Bleu Océan', hex: '#0284C7' },
    { name: 'Émeraude Végétal', hex: '#059669' },
    { name: 'Ambre Chaud', hex: '#D97706' },
    { name: 'Rubis Intense', hex: '#DC2626' },
    { name: 'Graphite', hex: '#1E293B' },
  ];

  readonly backgroundSwatches: readonly BrandColorSwatch[] = [
    { name: 'Blanc Pur', hex: '#ffffff' },
    { name: 'Crème Doux', hex: '#fdfbf7' },
    { name: 'Gris Perle', hex: '#f1f5f9' },
    { name: 'Ardoise Sombre', hex: '#0f172a' },
  ];

  readonly colorsForm: FormGroup = this.fb.group({
    dotsColorType: ['single' as 'single' | 'gradient'],
    dotsColorSingle: ['#000000'],
    dotsGradientType: ['linear' as GradientType],
    dotsGradientStart: ['#6750A4'],
    dotsGradientEnd: ['#0284C7'],
    dotsGradientRotation: [45],
    cornersColor: ['#000000'],
    backgroundColor: ['#ffffff'],
  });

  ngOnInit(): void {
    const d = this.initialConfig();
    const dotsColorType = d.dotsColor.kind;
    
    this.colorsForm.patchValue({
      dotsColorType: dotsColorType,
      dotsColorSingle: dotsColorType === 'single' ? d.dotsColor.color : '#000000',
      dotsGradientType: dotsColorType === 'gradient' ? d.dotsColor.gradient.type : 'linear',
      dotsGradientStart: dotsColorType === 'gradient' ? d.dotsColor.gradient.colorStops[0].color : '#6750A4',
      dotsGradientEnd: dotsColorType === 'gradient' ? d.dotsColor.gradient.colorStops[1].color : '#0284C7',
      dotsGradientRotation: dotsColorType === 'gradient' ? (d.dotsColor.gradient.rotation ?? 45) : 45,
      cornersColor: d.cornersColor,
      backgroundColor: d.backgroundColor,
    }, { emitEvent: false });

    this.colorsForm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((val) => {
        let dotsColor: QrColorConfig;
        if (val.dotsColorType === 'single') {
          dotsColor = { kind: 'single', color: val.dotsColorSingle };
        } else {
          dotsColor = {
            kind: 'gradient',
            gradient: {
              type: val.dotsGradientType as GradientType,
              rotation: Number(val.dotsGradientRotation) || 0,
              colorStops: [
                { offset: 0, color: val.dotsGradientStart },
                { offset: 1, color: val.dotsGradientEnd }
              ]
            }
          };
        }

        this.configChange.emit({
          dotsColor,
          cornersColor: val.cornersColor,
          backgroundColor: val.backgroundColor,
        });
      });
  }

  selectDotsColorType(type: 'single' | 'gradient'): void {
    this.colorsForm.patchValue({ dotsColorType: type });
  }

  selectGradientType(type: GradientType): void {
    this.colorsForm.patchValue({ dotsGradientType: type });
  }

  applySingleDotsColor(hex: string): void {
    this.colorsForm.patchValue({ dotsColorSingle: hex });
  }

  applyCornersColor(hex: string): void {
    this.colorsForm.patchValue({ cornersColor: hex });
  }

  applyBackgroundColor(hex: string): void {
    this.colorsForm.patchValue({ backgroundColor: hex });
  }
}
