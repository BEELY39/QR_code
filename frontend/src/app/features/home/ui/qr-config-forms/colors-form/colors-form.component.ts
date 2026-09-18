import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { QrColorConfig, QrDesignOptions, GradientType } from '../../../../../core/models/live-qr.model';

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

  readonly colorsForm: FormGroup = this.fb.group({
    dotsColorType: ['single'], // 'single' | 'gradient'
    dotsColorSingle: ['#000000'],
    dotsGradientType: ['linear' as GradientType],
    dotsGradientStart: ['#000000'],
    dotsGradientEnd: ['#000000'],
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
      dotsGradientStart: dotsColorType === 'gradient' ? d.dotsColor.gradient.colorStops[0].color : '#000000',
      dotsGradientEnd: dotsColorType === 'gradient' ? d.dotsColor.gradient.colorStops[1].color : '#000000',
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
              rotation: val.dotsGradientRotation,
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
}
