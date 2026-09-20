import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import {
  HeroSection,
  HERO_DOT_STYLES,
  HERO_QR_DATA,
} from './hero-section.component';
import { QrEngineService } from '../../../../core/services/qr-engine.service';
import { QrEngineOptions } from '../../../../core/models/qr-engine.model';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;
  let qrEngineMock: {
    getSvgString: (options: QrEngineOptions) => Promise<string>;
    isBrowser: boolean;
  };

  beforeEach(async () => {
    qrEngineMock = {
      isBrowser: true,
      getSvgString: vi.fn().mockImplementation((options: QrEngineOptions) => {
        return Promise.resolve(
          `<svg data-style="${options.dotsOptions.type}"><text>${options.data}</text></svg>`
        );
      }),
    };

    await TestBed.configureTestingModule({
      imports: [HeroSection],
      providers: [
        { provide: QrEngineService, useValue: qrEngineMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should encode "Bienvenue" as the QR code data', () => {
    expect(HERO_QR_DATA).toBe('Bienvenue');
  });

  it('should contain the 4 requested dot styles in order', () => {
    expect(component.styles.length).toBe(4);
    expect(component.styles[0].id).toBe('dots');
    expect(component.styles[0].label).toBe('Points circulaires');
    expect(component.styles[1].id).toBe('classy-rounded');
    expect(component.styles[1].label).toBe('Points modernes');
    expect(component.styles[2].id).toBe('rounded');
    expect(component.styles[2].label).toBe('Points arrondis');
    expect(component.styles[3].id).toBe('square');
    expect(component.styles[3].label).toBe('Carré géométrique');
  });

  it('should start with the first style ("Points circulaires")', () => {
    expect(component.currentStyleIndex()).toBe(0);
    expect(component.currentStyle().id).toBe('dots');
  });

  it('should populate svgCache and currentSvg on browser init', async () => {
    await component.initQrCodes();
    fixture.detectChanges();

    expect(component.currentSvg()).toBeTruthy();
    expect(component.svgCache().has('dots')).toBe(true);
    expect(component.svgCache().has('classy-rounded')).toBe(true);
    expect(component.svgCache().has('rounded')).toBe(true);
    expect(component.svgCache().has('square')).toBe(true);
  });

  it('should cycle through styles on switchStyle()', () => {
    vi.useFakeTimers();
    expect(component.currentStyleIndex()).toBe(0);

    component.switchStyle();
    expect(component.isTransitioning()).toBe(true);

    vi.advanceTimersByTime(250);
    expect(component.currentStyleIndex()).toBe(1);
    expect(component.currentStyle().id).toBe('classy-rounded');
    expect(component.isTransitioning()).toBe(false);

    component.switchStyle();
    vi.advanceTimersByTime(250);
    expect(component.currentStyleIndex()).toBe(2);
    expect(component.currentStyle().id).toBe('rounded');

    component.switchStyle();
    vi.advanceTimersByTime(250);
    expect(component.currentStyleIndex()).toBe(3);
    expect(component.currentStyle().id).toBe('square');

    component.switchStyle();
    vi.advanceTimersByTime(250);
    expect(component.currentStyleIndex()).toBe(0);
    expect(component.currentStyle().id).toBe('dots');

    vi.useRealTimers();
  });
});

