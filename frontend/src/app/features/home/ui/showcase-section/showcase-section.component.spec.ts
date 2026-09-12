import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseSection } from './showcase-section.component';

describe('ShowcaseSection', () => {
  let component: ShowcaseSection;
  let fixture: ComponentFixture<ShowcaseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcaseSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
