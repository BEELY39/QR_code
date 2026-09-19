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

  it('devrait basculer la visibilité du mot de passe avec toggleShowPassword', () => {
    expect(component.showPassword()).toBe(false);
    component.toggleShowPassword();
    expect(component.showPassword()).toBe(true);
    component.toggleShowPassword();
    expect(component.showPassword()).toBe(false);
  });

  it('devrait mettre à jour le type de sécurité via selectEncryption', () => {
    component.selectEncryption('nopass');
    expect(component.wifiForm.get('encryption')?.value).toBe('nopass');
  });
});

