import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FaqSectionComponent } from './faq-section.component';
import { LANDING_FAQ_IDS } from '../../../../core/constants/faq.constant';

describe('FaqSectionComponent', () => {
  let component: FaqSectionComponent;
  let fixture: ComponentFixture<FaqSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche les 6 questions de la maquette, dans son ordre', () => {
    const ids = component.faqs().map((faq) => faq.id);
    expect(ids).toEqual(LANDING_FAQ_IDS);
    const buttons = fixture.nativeElement.querySelectorAll('button[id^="faq-btn-"]');
    expect(buttons.length).toBe(6);
  });

  it('should have the first FAQ item open by default', () => {
    expect(component.openFaqId()).toBe('faq-free');
    expect(component.isOpen('faq-free')).toBe(true);

    const firstPanel = fixture.nativeElement.querySelector('#faq-panel-faq-free');
    expect(firstPanel).toBeTruthy();
  });

  it('should toggle FAQ open and closed on click', () => {
    // Click currently open item -> closes
    component.toggleFaq('faq-free');
    expect(component.openFaqId()).toBeNull();
    expect(component.isOpen('faq-free')).toBe(false);

    fixture.detectChanges();
    const panelClosed = fixture.nativeElement.querySelector('#faq-panel-faq-free');
    expect(panelClosed).toBeNull();

    // Click again -> opens
    component.toggleFaq('faq-free');
    expect(component.openFaqId()).toBe('faq-free');
    expect(component.isOpen('faq-free')).toBe(true);
  });

  it('should switch open FAQ item when another is clicked', () => {
    component.toggleFaq('faq-scan-data');
    expect(component.openFaqId()).toBe('faq-scan-data');
    expect(component.isOpen('faq-free')).toBe(false);
    expect(component.isOpen('faq-scan-data')).toBe(true);

    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('#faq-panel-faq-scan-data');
    expect(panel).toBeTruthy();
  });

  it('masque les questions 5 et 6 en mobile (FR-029)', () => {
    const items: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button[id^="faq-btn-"]')
    ).map((b: unknown) => (b as HTMLElement).parentElement as HTMLElement);
    expect(items[4].classList.contains('hidden')).toBe(true);
    expect(items[5].classList.contains('hidden')).toBe(true);
    expect(items[3].classList.contains('hidden')).toBe(false);
  });
});
