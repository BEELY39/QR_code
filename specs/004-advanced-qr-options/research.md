# Phase 0: Research & Technical Approach

## 1. Client-Side Logo Uploads
- **Decision**: Use native HTML `<input type="file" accept="image/*">` and `FileReader` to read the file as a `data:` URL (Base64).
- **Rationale**: Strict compliance with Constitution Principle I (Zero-Serveur) and III (Hygiene Memoire). `qr-code-styling` natively accepts `data:` URLs for the `image` property.
- **Alternatives considered**: `URL.createObjectURL()`. However, `FileReader.readAsDataURL()` avoids the need for manual memory management and revocation since `qr-code-styling` will embed the Base64 string directly in the SVG output, making the SVG portable.

## 2. Advanced QR Code Styling (Frames, Dots, Colors, Gradients)
- **Decision**: Pass expanded configuration options to `qr-code-styling`. It supports:
  - `dotsOptions.type` (e.g., 'dots', 'rounded', 'classy')
  - `dotsOptions.color` and `dotsOptions.gradient` (linear/radial)
  - `backgroundOptions.color`
  - `imageOptions.crossOrigin` and `margin`
- **Rationale**: The library natively supports the requested features (dots, logos, colors, gradients).
- **Alternatives considered**: Manually hacking the SVG output. Rejected due to complexity and the fact that `qr-code-styling` already provides a robust API for these exact features.

## 3. Wi-Fi String Formatting
- **Decision**: Use the standard `WIFI:T:WPA;S:NetworkName;P:Password;H:false;;` format.
- **Rationale**: This is the universal standard recognized by iOS and Android camera apps for instant Wi-Fi connection.
- **Alternatives considered**: Proprietary deep links. Rejected because they lack native OS support.

## 4. Custom Frames and Text ("SCAN ME")
- **Decision**: `qr-code-styling` does *not* natively draw external frames with text outside the QR matrix. We will wrap the generated SVG in a custom SVG or HTML/CSS frame container before exporting via `html-to-image` (already used in the project).
- **Rationale**: `qr-code-styling` only handles the core QR matrix and central logo. To add an external frame with "SCAN ME" text, we must build a UI container around the QR code and use `html-to-image` to capture the entire composite element as the final image.
- **Alternatives considered**: Forking `qr-code-styling`. Rejected as it violates maintainability.

## 5. Google Fonts Integration
- **Decision**: Load selected fonts via standard `<link>` tags in `index.html` or dynamically via Web Font Loader, and apply them via CSS to the frame text.
- **Rationale**: Standard web fonts will render correctly in the browser and will be captured successfully by `html-to-image`.
