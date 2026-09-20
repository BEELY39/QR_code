import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include link to /articles in desktop navigation', () => {
    const articlesLink: HTMLAnchorElement = fixture.nativeElement.querySelector('#nav-articles-link');
    expect(articlesLink).toBeTruthy();
    expect(articlesLink.getAttribute('href')).toBe('/articles');
  });

  it('should toggle mobile menu and include link to /articles', () => {
    expect(component.menuOpen()).toBe(false);

    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);

    fixture.detectChanges();
    const mobileLink: HTMLAnchorElement = fixture.nativeElement.querySelector('#mobile-nav-articles-link');
    expect(mobileLink).toBeTruthy();
    expect(mobileLink.getAttribute('href')).toBe('/articles');

    component.closeMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('should not contain dead #tarifs link', () => {
    const tarifsLink = fixture.nativeElement.querySelector('a[href="#tarifs"]');
    expect(tarifsLink).toBeNull();
  });
});
