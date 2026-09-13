import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ColorPalette } from '../../../../core/models/palette.model';
import { InputMode } from '../../../../core/models/live-qr.model';

@Component({
  selector: 'app-simulator-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator-section.component.html',
  styleUrl: './simulator-section.component.css',
})
export class SimulatorSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly mode = input<InputMode>('url');
  readonly rawValue = input<string>('https://instagram.com/monbistro');
  readonly url = input<string>(''); // alias de rétrocompatibilité
  readonly palettes = input.required<readonly ColorPalette[]>();
  readonly selectedPalette = input.required<ColorPalette>();
  readonly bottomText = input.required<string>();
  readonly displayUrl = input.required<string>();
  readonly qrSvgMarkup = input<string>('');
  readonly isGenerating = input<boolean>(false);

  readonly modeChange = output<InputMode>();
  readonly valueChange = output<string>();
  readonly urlChange = output<string>(); // alias de rétrocompatibilité
  readonly paletteSelect = output<string>();
  readonly bottomTextChange = output<string>();
  readonly downloadClick = output<void>();

  protected readonly safeQrSvgMarkup = computed<SafeHtml>(() => {
    const markup = this.qrSvgMarkup();
    return markup ? this.sanitizer.bypassSecurityTrustHtml(markup) : '';
  });

  protected readonly currentInputValue = computed<string>(() => {
    const direct = this.rawValue();
    if (direct && direct.length > 0) return direct;
    return this.url();
  });

  onModeSelect(newMode: InputMode): void {
    this.modeChange.emit(newMode);
  }

  onValueInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
    this.urlChange.emit(inputElement.value);
  }

  onUrlInput(event: Event): void {
    this.onValueInput(event);
  }

  onBottomTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.bottomTextChange.emit(inputElement.value);
  }

  onPaletteClick(id: string): void {
    this.paletteSelect.emit(id);
  }

  onDownload(): void {
    this.downloadClick.emit();
  }
}
export { SimulatorSectionComponent as SimulatorSection };
