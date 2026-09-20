import { ChangeDetectionStrategy, Component, OnInit, output, input, signal } from '@angular/core';
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
  readonly isDragging = signal<boolean>(false);

  ngOnInit(): void {
    this.currentLogo.set(this.initialLogo());
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }
    this.processFile(inputElement.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    // Validation du format
    if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
      this.error.set('Format non supporté. Veuillez utiliser un fichier PNG, JPG ou SVG.');
      return;
    }

    // Validation du poids (max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      this.error.set('Le fichier dépasse la taille maximale autorisée (2 Mo).');
      return;
    }

    this.error.set(null);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64 = e.target?.result as string;
      this.currentLogo.set(base64);
      this.logoChange.emit(base64);
    };
    reader.onerror = () => {
      this.error.set('Une erreur est survenue lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.currentLogo.set(null);
    this.error.set(null);
    this.logoChange.emit(null);
  }
}
