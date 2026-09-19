import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FrameStyleType, QrFrameOptions, VisualOption } from '../../../../../core/models/live-qr.model';

@Component({
  selector: 'app-frame-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './frame-form.component.html',
  styleUrl: './frame-form.component.scss'
})
export class FrameFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialConfig = input<QrFrameOptions | null>(null);
  readonly configChange = output<QrFrameOptions>();

  readonly frameStyles: readonly VisualOption<FrameStyleType>[] = [
    { value: 'simple-bottom', label: 'Bandeau inférieur', description: 'Style classique avec bandeau plein', iconName: 'view_agenda' },
    { value: 'badge-bottom', label: 'Badge flottant', description: 'Pilule arrondie avec flèche callout', iconName: 'chat_bubble' },
    { value: 'rounded-border', label: 'Bordure arrondie', description: 'Contour fin et élégant sans bandeau', iconName: 'rounded_corner' },
    { value: 'none', label: 'Aucun cadre', description: 'QR code pur sans bordure', iconName: 'crop_free' },
  ];

  readonly fonts: readonly string[] = ['Roboto', 'Montserrat', 'Open Sans', 'Lato', 'Poppins'];

  readonly colorPresets: readonly { name: string; hex: string }[] = [
    { name: 'Noir Absolu', hex: '#000000' },
    { name: 'Bleu Royal', hex: '#0026ff' },
    { name: 'Violet Luxe', hex: '#412ce7' },
    { name: 'Vert Émeraude', hex: '#00796f' },
    { name: 'Rouge Corail', hex: '#b4252d' },
  ];

  readonly frameForm: FormGroup = this.fb.group({
    style: ['simple-bottom' as FrameStyleType],
    text: ['SCAN ME'],
    font: ['Roboto'],
    frameColor: ['#000000'],
    textColor: ['#ffffff'],
  });

  ngOnInit(): void {
    const initial = this.initialConfig();
    if (initial) {
      this.frameForm.patchValue(initial, { emitEvent: false });
    }

    this.frameForm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.frameForm.valid) {
          const val = this.frameForm.value;
          this.configChange.emit({
            style: val.style as FrameStyleType,
            text: val.text ?? '',
            font: val.font ?? 'Roboto',
            frameColor: val.frameColor ?? '#000000',
            textColor: val.textColor ?? '#ffffff',
          });
        }
      });
  }

  selectStyle(style: FrameStyleType): void {
    this.frameForm.patchValue({ style });
  }

  selectColorPreset(hex: string): void {
    this.frameForm.patchValue({ frameColor: hex });
  }
}
