import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DotStyleType } from '../../../../../core/models/live-qr.model';

@Component({
  selector: 'app-styling-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './styling-form.component.html',
  styleUrls: ['./styling-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialStyle = input<DotStyleType>('rounded');
  
  readonly styleChange = output<DotStyleType>();

  readonly stylingForm: FormGroup = this.fb.group({
    dotsStyle: ['rounded' as DotStyleType],
  });

  readonly dotStyles: readonly { value: DotStyleType; label: string }[] = [
    { value: 'rounded', label: 'Arrondi (Moderne)' },
    { value: 'dots', label: 'Points (Circulaire)' },
    { value: 'classy', label: 'Élégant' },
    { value: 'classy-rounded', label: 'Élégant & Arrondi' },
    { value: 'square', label: 'Carré (Classique)' },
    { value: 'extra-rounded', label: 'Très Arrondi' },
  ];

  ngOnInit(): void {
    const initial = this.initialStyle();
    this.stylingForm.patchValue({ dotsStyle: initial }, { emitEvent: false });

    this.stylingForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.stylingForm.valid) {
          this.styleChange.emit(this.stylingForm.value.dotsStyle as DotStyleType);
        }
      });
  }
}
