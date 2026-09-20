import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WifiConfig, WifiEncryption, VisualOption } from '../../../../../core/models/live-qr.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-wifi-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wifi-form.component.html',
  styleUrls: ['./wifi-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WifiFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialConfig = input<WifiConfig | null>(null);
  readonly configChange = output<WifiConfig>();

  readonly showPassword = signal<boolean>(false);

  readonly wifiForm: FormGroup = this.fb.group({
    ssid: ['', Validators.required],
    encryption: ['WPA2' as WifiEncryption, Validators.required],
    password: [''],
    hidden: [false],
  });

  readonly encryptionOptions: readonly VisualOption<WifiEncryption>[] = [
    { value: 'WPA2', label: 'WPA2 / WPA3', iconName: 'lock' },
    { value: 'WPA', label: 'WPA', iconName: 'lock' },
    { value: 'WEP', label: 'WEP', iconName: 'shield' },
    { value: 'nopass', label: 'Réseau Ouvert', iconName: 'lock_open' },
  ];

  ngOnInit(): void {
    const initial = this.initialConfig();
    if (initial) {
      this.wifiForm.patchValue(initial, { emitEvent: false });
    }

    this.wifiForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.wifiForm.valid) {
          const formValue = this.wifiForm.value;
          this.configChange.emit({
            ssid: formValue.ssid ?? '',
            encryption: formValue.encryption as WifiEncryption,
            password: formValue.password ?? '',
            hidden: formValue.hidden ?? false,
          });
        }
      });
  }

  selectEncryption(enc: WifiEncryption): void {
    this.wifiForm.patchValue({ encryption: enc });
  }

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }
}
