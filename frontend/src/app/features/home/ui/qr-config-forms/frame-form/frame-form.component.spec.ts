import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameFormComponent as FrameForm } from './frame-form.component';

describe('FrameForm', () => {
  let component: FrameForm;
  let fixture: ComponentFixture<FrameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

