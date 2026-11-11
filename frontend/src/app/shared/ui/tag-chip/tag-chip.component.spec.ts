import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagChipComponent } from './tag-chip.component';

describe('TagChipComponent', () => {
  let fixture: ComponentFixture<TagChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TagChipComponent] }).compileComponents();
    fixture = TestBed.createComponent(TagChipComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('rend en monospace sur fond d\'accent clair', () => {
    const chip: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(chip.classList).toContain('font-qc-mono');
    expect(chip.classList).toContain('bg-qc-accent-soft');
  });
});
