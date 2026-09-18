import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-form.component.html',
  styleUrls: ['./logo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoFormComponent implements OnInit {
  readonly initialLogo = input<string | null>(null);
  readonly logoChange = output<string | null>();

  readonly currentLogo = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.currentLogo.set(this.initialLogo());
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file = inputElement.files[0];
    
    // Validation
    if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
      this.error.set("Format invalide. Utilisez PNG, JPG ou SVG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.error.set("Fichier trop volumineux (max 2MB).");
      return;
    }

    this.error.set(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.currentLogo.set(base64);
      this.logoChange.emit(base64);
    };
    reader.onerror = () => {
      this.error.set("Erreur lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.currentLogo.set(null);
    this.logoChange.emit(null);
  }
}
