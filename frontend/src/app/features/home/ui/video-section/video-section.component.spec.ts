import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoSectionComponent } from './video-section.component';
import {
  PRESENTATION_VIDEO,
  buildEmbedUrl,
  buildThumbnailUrl,
  buildWatchUrl,
  hasVideoSource,
  toIso8601Duration,
  toReadableDuration,
} from '../../../../core/constants/video.constant';

describe('VideoSectionComponent', () => {
  let fixture: ComponentFixture<VideoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoSectionComponent);
    fixture.detectChanges();
  });

  it('ne rend la section que si une source vidéo est configurée', () => {
    const section = fixture.nativeElement.querySelector('section#demo');
    if (hasVideoSource(PRESENTATION_VIDEO)) {
      expect(section).toBeTruthy();
    } else {
      expect(section).toBeNull();
    }
  });

  it("n'insère ni iframe ni balise vidéo avant le clic", () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('iframe')).toBeNull();
    expect(el.querySelector('video')).toBeNull();
  });

  it('charge le lecteur seulement après le clic', () => {
    if (!hasVideoSource(PRESENTATION_VIDEO)) {
      expect(fixture.componentInstance.isStarted()).toBe(false);
      return;
    }

    const el: HTMLElement = fixture.nativeElement;
    el.querySelector<HTMLButtonElement>('#video-play-button')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isStarted()).toBe(true);
    expect(el.querySelector('#presentation-video')).toBeTruthy();
    expect(el.querySelector('#video-play-button')).toBeNull();
  });
});

describe('configuration de la vidéo', () => {
  it('considère une source YouTube vide comme non configurée', () => {
    expect(hasVideoSource({ ...PRESENTATION_VIDEO, source: { kind: 'youtube', videoId: '' } })).toBe(false);
    expect(hasVideoSource({ ...PRESENTATION_VIDEO, source: { kind: 'youtube', videoId: 'abc123' } })).toBe(true);
  });

  it("construit une URL d'intégration sans cookie et en lecture automatique", () => {
    const url = buildEmbedUrl({ kind: 'youtube', videoId: 'abc123' });
    expect(url).toContain('youtube-nocookie.com/embed/abc123');
    expect(url).toContain('autoplay=1');
    expect(url).toContain('rel=0');
  });

  it('pointe la vignette et la page publique vers YouTube', () => {
    const video = { ...PRESENTATION_VIDEO, source: { kind: 'youtube' as const, videoId: 'abc123' } };
    expect(buildThumbnailUrl(video, 'https://exemple.fr')).toBe('https://i.ytimg.com/vi/abc123/maxresdefault.jpg');
    expect(buildWatchUrl(video.source, 'https://exemple.fr')).toBe('https://www.youtube.com/watch?v=abc123');
  });

  it('retombe sur le site pour une source fichier', () => {
    const source = { kind: 'file' as const, src: '/demo.mp4', mimeType: 'video/mp4' };
    expect(buildWatchUrl(source, 'https://exemple.fr')).toBe('https://exemple.fr/demo.mp4');
    expect(buildEmbedUrl(source)).toBe('');
  });

  it('formate la durée pour Schema.org et pour l\'affichage', () => {
    expect(toIso8601Duration(65)).toBe('PT1M5S');
    expect(toIso8601Duration(45)).toBe('PT45S');
    expect(toReadableDuration(65)).toBe('1 min 05');
    expect(toReadableDuration(45)).toBe('45 s');
  });
});
