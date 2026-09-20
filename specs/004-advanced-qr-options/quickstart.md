# Validation Quickstart

This guide outlines how to manually validate the new advanced QR code options in the Angular dev environment.

## 1. Start the Dev Server

Ensure you are in the project root and run:

```bash
npm start
```
Navigate to `http://localhost:4200/`.

## 2. Validate Wi-Fi QR Code

1. Click on the "Wi-Fi" tab in the input section.
2. Enter the following details:
   - **Nom du réseau (SSID)**: `GuestNetwork`
   - **Type de chiffrement**: `WPA`
   - **Mot de passe**: `SuperSecret123!`
   - **Réseau masqué**: Check the box.
3. Open the camera app on your iOS or Android device.
4. Scan the generated QR code on your screen.
5. **Expected Outcome**: Your device should prompt you to join the "GuestNetwork" Wi-Fi network.

## 3. Validate Visual Styling (Dots & Colors)

1. Navigate to the "Forme" (Shape) tab.
2. Select the "Pointillé" (dotted) style.
3. Navigate to the "Couleurs" tab.
4. Select a radial gradient (e.g., Blue to Purple).
5. **Expected Outcome**: The preview updates in < 200ms. The dots in the QR code are circular, and the gradient applies seamlessly across the entire matrix.

## 4. Validate Custom Frames

1. Navigate to the "Cadre" (Frame) tab.
2. Select the rounded frame template.
3. In the "Texte du cadre" input, type `MENU`.
4. In the "Police" dropdown, select `Roboto`.
5. **Expected Outcome**: A styled border appears around the QR code with the word `MENU` at the bottom in the Roboto font.

## 5. Validate Logo Upload

1. Navigate to the "Logo" tab.
2. Click the upload area and select a PNG image from your computer.
3. **Expected Outcome**: The image is rendered in the center of the QR code.
4. Scan the QR code again with your phone.
5. **Expected Outcome**: The QR code remains perfectly scannable despite the logo obscuring the center (thanks to 'H' error correction).

## 6. Validate Export

1. Click the "Télécharger" (Download) button below the QR code.
2. **Expected Outcome**: A high-resolution PNG is downloaded containing the QR code, the logo, and the custom frame. The memory footprint (object URLs) should be cleaned up immediately.
