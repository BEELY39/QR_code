import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ColorPalette } from '../../../../core/models/palette.model';
import { InputMode, WifiConfig, QrDesignOptions, QrFrameOptions, DotStyleType } from '../../../../core/models/live-qr.model';
import { WifiFormComponent } from '../qr-config-forms/wifi-form/wifi-form.component';
import { FrameFormComponent } from '../qr-config-forms/frame-form/frame-form.component';
import { StylingFormComponent } from '../qr-config-forms/styling-form/styling-form.component';
import { LogoFormComponent } from '../qr-config-forms/logo-form/logo-form.component';
import { ColorsFormComponent } from '../qr-config-forms/colors-form/colors-form.component';
import { PrintPackFormat, PRINT_PACK_FORMATS } from '../../../../core/models/print-pack.model';

@Component({
  selector: 'app-simulator-section',
  standalone: true,
  imports: [CommonModule, FormsModule, WifiFormComponent, FrameFormComponent, StylingFormComponent, LogoFormComponent, ColorsFormComponent],
  templateUrl: './simulator-section.component.html',
  styleUrl: './simulator-section.component.css',
})
export class SimulatorSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly activeDesignTab = signal<'palette' | 'colors' | 'frame' | 'style' | 'logo'>('palette');
  readonly selectedFormat = signal<'svg' | 'png'>('svg');

  /** Pack impression : gabarits PDF prêts à poser */
  readonly printFormats = PRINT_PACK_FORMATS;
  readonly selectedPrintFormat = signal<PrintPackFormat>('chevalet-a6');
  readonly printCredit = signal<boolean>(true);
  readonly isPreparingPrint = signal<boolean>(false);
  readonly mode = input<InputMode>('url');
  readonly rawValue = input<string>('https://instagram.com/monbistro');
  readonly url = input<string>(''); // alias de rétrocompatibilité
  readonly palettes = input.required<readonly ColorPalette[]>();
  readonly selectedPalette = input.required<ColorPalette>();
  readonly bottomText = input.required<string>();
  readonly displayUrl = input.required<string>();
  readonly qrSvgMarkup = input<string>('');
  readonly isGenerating = input<boolean>(false);
  readonly wifiConfig = input<WifiConfig | null>(null);
  readonly design = input.required<QrDesignOptions>();

  readonly modeChange = output<InputMode>();
  readonly wifiConfigChange = output<WifiConfig>();
  readonly designChange = output<Partial<QrDesignOptions>>();
  readonly valueChange = output<string>();
  readonly urlChange = output<string>(); // alias de rétrocompatibilité
  readonly paletteSelect = output<string>();
  readonly bottomTextChange = output<string>();
  readonly downloadClick = output<void>();
  readonly downloadPngClick = output<void>();
  readonly printPackClick = output<{ format: PrintPackFormat; withCredit: boolean }>();

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

  setActiveDesignTab(tab: 'palette' | 'colors' | 'frame' | 'style' | 'logo'): void {
    this.activeDesignTab.set(tab);
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

  onWifiConfigChange(config: WifiConfig): void {
    this.wifiConfigChange.emit(config);
  }

  onFrameChange(frame: QrFrameOptions): void {
    this.designChange.emit({ frame });
  }

  onDotStyleChange(dotsStyle: DotStyleType): void {
    this.designChange.emit({ dotsStyle });
  }

  onLogoChange(customLogoBase64: string | null): void {
    this.designChange.emit({ customLogoBase64 });
  }

  onColorsChange(colors: Partial<QrDesignOptions>): void {
    this.designChange.emit(colors);
  }

  onPaletteClick(id: string): void {
    this.paletteSelect.emit(id);
  }

  setFormat(format: 'svg' | 'png'): void {
    this.selectedFormat.set(format);
  }

  onDownload(): void {
    if (this.selectedFormat() === 'svg') {
      this.downloadClick.emit();
    } else {
      this.downloadPngClick.emit();
    }
  }

  onDownloadPng(): void {
    this.downloadPngClick.emit();
  }

  selectPrintFormat(format: PrintPackFormat): void {
    this.selectedPrintFormat.set(format);
  }

  togglePrintCredit(): void {
    this.printCredit.update((v) => !v);
  }

  onPrintPack(): void {
    this.isPreparingPrint.set(true);
    this.printPackClick.emit({
      format: this.selectedPrintFormat(),
      withCredit: this.printCredit(),
    });
    // La génération est déléguée au parent : on relâche l'état après un court délai
    // pour que le bouton ne reste pas bloqué si le parent ne renvoie rien.
    setTimeout(() => this.isPreparingPrint.set(false), 1200);
  }
}
export { SimulatorSectionComponent as SimulatorSection };
