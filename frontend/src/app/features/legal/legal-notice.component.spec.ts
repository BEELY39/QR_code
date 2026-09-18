import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LegalNoticeComponent } from './legal-notice.component';

describe('LegalNoticeComponent', () => {
  let fixture: ComponentFixture<LegalNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticeComponent);
    fixture.detectChanges();
  });

  it('devrait afficher le titre et toutes les sections du sommaire', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Mentions légales');

    const sectionIds = fixture.componentInstance['sections'].map((s) => s.id);
    for (const id of sectionIds) {
      expect(el.querySelector(`#${id}`)).toBeTruthy();
    }
  });

  it('devrait intégrer la navbar et le footer du site', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-navbar')).toBeTruthy();
    expect(el.querySelector('app-footer')).toBeTruthy();
  });
});
