import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPalette } from '../../../../core/models/palette.model';

@Component({
  selector: 'app-simulator-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator-section.component.html',
  styleUrl: './simulator-section.component.css',
})
export class SimulatorSectionComponent {
  readonly url = input.required<string>();
  readonly palettes = input.required<ColorPalette[]>();
  readonly selectedPalette = input.required<ColorPalette>();
  readonly bottomText = input.required<string>();
  readonly displayUrl = input.required<string>();

  readonly urlChange = output<string>();
  readonly paletteSelect = output<string>();
  readonly bottomTextChange = output<string>();

  onUrlInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.urlChange.emit(inputElement.value);
  }

  onBottomTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.bottomTextChange.emit(inputElement.value);
  }

  onPaletteClick(id: string): void {
    this.paletteSelect.emit(id);
  }
}
export { SimulatorSectionComponent as SimulatorSection };
