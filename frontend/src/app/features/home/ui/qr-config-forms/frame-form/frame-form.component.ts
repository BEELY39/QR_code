import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FrameStyleType, QrFrameOptions } from '../../../../../core/models/live-qr.model';

@Component({
  selector: 'app-frame-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './frame-form.component.html',
  styleUrls: ['./frame-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialConfig = input<QrFrameOptions | null>(null);
  
  readonly configChange = output<QrFrameOptions>();

  readonly frameForm: FormGroup = this.fb.group({
    style: ['none' as FrameStyleType],
    text: ['SCAN ME'],
    font: ['Roboto'],
    frameColor: ['#000000'],
    textColor: ['#ffffff'],
  });

  readonly frameStyles: readonly { value: FrameStyleType; label: string }[] = [
    { value: 'none', label: 'Aucun cadre' },
    { value: 'simple-bottom', label: 'Bandeau simple' },
    { value: 'rounded-bottom', label: 'Bordures arrondies' },
    { value: 'badge-bottom', label: 'Style Badge flotant' },
  ];

  readonly fonts: readonly string[] = ['Roboto', 'Montserrat', 'Open Sans', 'Lato', 'Poppins'];

  ngOnInit(): void {
    const initial = this.initialConfig();
    if (initial) {
      this.frameForm.patchValue(initial, { emitEvent: false });
    }

    this.frameForm.valueChanges
      .pipe(
        debounceTime(200),
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
}
