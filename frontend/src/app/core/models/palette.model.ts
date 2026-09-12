export interface ColorPalette {
  id: string;
  name: string;
  gradientClass: string;
  dotColor: string;
  cornerColor: string;
  badgeBg: string;
  badgeText: string;
  previewGradient: {
    start: string;
    mid?: string;
    end: string;
  };
}

export interface SimulatorState {
  rawUrl: string;
  selectedPaletteId: string;
  bottomText: string;
  displayUrl: string;
}
