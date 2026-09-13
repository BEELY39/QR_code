export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface GradientOptions {
  type: 'linear' | 'radial';
  rotation?: number;
  colorStops: Array<{ offset: number; color: string }>;
}

export interface QrEngineOptions {
  width: number;
  height: number;
  data: string;
  margin?: number;
  image?: string;
  qrOptions: {
    typeNumber: number;
    mode?: 'Byte' | 'Numeric' | 'Alphanumeric' | 'Kanji';
    errorCorrectionLevel: ErrorCorrectionLevel;
  };
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    margin?: number;
    crossOrigin?: string;
  };
  dotsOptions: {
    type: DotType;
    color?: string;
    gradient?: GradientOptions;
  };
  cornersSquareOptions: {
    type?: CornerSquareType;
    color?: string;
    gradient?: GradientOptions;
  };
  cornersDotOptions: {
    type?: CornerDotType;
    color?: string;
    gradient?: GradientOptions;
  };
  backgroundOptions?: {
    color?: string;
    gradient?: GradientOptions;
  };
}
