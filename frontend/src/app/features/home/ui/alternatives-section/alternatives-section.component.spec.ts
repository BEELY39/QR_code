import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlternativesSectionComponent } from './alternatives-section.component';

describe('AlternativesSectionComponent', () => {
  let component: AlternativesSectionComponent;
  let fixture: ComponentFixture<AlternativesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlternativesSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlternativesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all 4 market alternatives', () => {
    expect(component.alternatives().length).toBe(4);
    const cards = fixture.nativeElement.querySelectorAll('#alternatives [id^="alt-"]');
    expect(cards.length).toBe(4);
  });

  it('should display comparison for Canva, QRCode Monkey, Bitly and Unitag', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Canva QR');
    expect(textContent).toContain('QRCode Monkey');
    expect(textContent).toContain('Bitly / QR Code Generator');
    expect(textContent).toContain('Unitag');
  });

  it('should invoke scrollBy on track element when scrollLeft or scrollRight are called', () => {
    const track = component.carouselTrack()?.nativeElement;
    expect(track).toBeTruthy();

    if (track) {
      track.scrollBy = vi.fn();

      component.scrollLeft();
      expect(track.scrollBy).toHaveBeenCalledWith({ left: -360, behavior: 'smooth' });

      component.scrollRight();
      expect(track.scrollBy).toHaveBeenCalledWith({ left: 360, behavior: 'smooth' });
    }
  });
});
