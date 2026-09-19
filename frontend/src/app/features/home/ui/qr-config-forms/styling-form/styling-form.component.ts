import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DotStyleType, VisualOption } from '../../../../../core/models/live-qr.model';

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

  readonly dotStyles: readonly VisualOption<DotStyleType>[] = [
    { 
      value: 'rounded', 
      label: 'Arrondi moderne', 
      description: 'Coins doux et galbés', 
      iconName: 'lens' 
    },
    { 
      value: 'dots', 
      label: 'Points circulaires', 
      description: 'Pastilles pleines contemporaines', 
      iconName: 'radio_button_checked' 
    },
    { 
      value: 'classy', 
      label: 'Élégant haute couture', 
      description: 'Angles biseautés raffinés', 
      iconName: 'diamond' 
    },
    { 
      value: 'classy-rounded', 
      label: 'Élégant adouci', 
      description: 'Alliance d’angles et de courbes', 
      iconName: 'stars' 
    },
    { 
      value: 'square', 
      label: 'Carré géométrique', 
      description: 'Matrice classique ultra-nette', 
      iconName: 'square' 
    },
    { 
      value: 'extra-rounded', 
      label: 'Ultra arrondi', 
      description: 'Bulles douces et épurées', 
      iconName: 'circle' 
    },
  ];

  ngOnInit(): void {
    const initial = this.initialStyle();
    this.stylingForm.patchValue({ dotsStyle: initial }, { emitEvent: false });

    this.stylingForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (this.stylingForm.valid && val.dotsStyle) {
          this.styleChange.emit(val.dotsStyle as DotStyleType);
        }
      });
  }

  selectDotStyle(style: DotStyleType): void {
    this.stylingForm.patchValue({ dotsStyle: style });
  }

  isSelected(style: DotStyleType): boolean {
    return this.stylingForm.get('dotsStyle')?.value === style;
  }
}
