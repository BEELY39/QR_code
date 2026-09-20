import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FaqSectionComponent } from './faq-section.component';
import { FAQ_ITEMS } from '../../../../core/constants/faq.constant';

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

  it('should render all 7 FAQ items', () => {
    expect(component.faqs().length).toBe(7);
    const buttons = fixture.nativeElement.querySelectorAll('button[id^="faq-btn-"]');
    expect(buttons.length).toBe(7);
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
    component.toggleFaq('faq-expiration');
    expect(component.openFaqId()).toBe('faq-expiration');
    expect(component.isOpen('faq-free')).toBe(false);
    expect(component.isOpen('faq-expiration')).toBe(true);

    fixture.detectChanges();
    const expirationPanel = fixture.nativeElement.querySelector('#faq-panel-faq-expiration');
    expect(expirationPanel).toBeTruthy();
  });
});
