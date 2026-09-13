export type ExportFormat = 'png' | 'svg' | 'pdf';
export type ExportScale = 1 | 2 | 3;

export interface ExportOptions {
  format: ExportFormat;
  scale: ExportScale;
  filename: string;
  elementId?: string;
  pdfPageSize?: 'a4' | 'a5' | 'a6' | 'custom';
  pdfOrientation?: 'portrait' | 'landscape';
}

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  filename: string;
  revocationCallback: () => void;
}
