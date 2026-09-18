import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiFormComponent as WifiForm } from './wifi-form.component';

describe('WifiForm', () => {
  let component: WifiForm;
  let fixture: ComponentFixture<WifiForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WifiForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WifiForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

