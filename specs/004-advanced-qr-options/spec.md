# Feature Specification: advanced-qr-options

**Feature Branch**: `[004-advanced-qr-options]`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Compléter la feature de génération de QR code... [Wi-Fi, Cadres, Formes, Logo, Couleurs/Dégradés]"

## Clarifications

### Session 2026-09-19
- Q: Comment doivent être gérés les logos uploadés ? → A: Traités uniquement dans le navigateur (client-side, plus rapide et privé)
- Q: Pour les dégradés de couleurs, quels types souhaitez-vous supporter ? → A: Dégradés linéaires et radiaux
- Q: Pour la police du texte du cadre ("Police de la phrase"), quelle approche privilégier ? → A: Une sélection de Google Fonts modernes

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Wi-Fi QR Code Configuration (Priority: P1)

As a user, I want to create a QR code for a Wi-Fi network so that guests can scan it to connect automatically.

**Why this priority**: Wi-Fi is one of the most common and requested QR code use cases, providing immediate utility.

**Independent Test**: Can be fully tested by selecting the Wi-Fi mode, filling in SSID, Encryption, and Password, and verifying the generated QR code connects a mobile device to the corresponding Wi-Fi network.

**Acceptance Scenarios**:

1. **Given** the user is on the QR simulator, **When** they select the "Wi-Fi" tab, **Then** a form with fields for Network Name (SSID), Encryption Type (WEP/WPA/None), Password, and a "Hidden network" checkbox is displayed.
2. **Given** the Wi-Fi form is filled, **When** the user types their credentials, **Then** the QR code updates in real-time to encode the correct `WIFI:T:WPA;S:NetworkName;P:Password;H:false;;` string.

---

### User Story 2 - Customizing QR Code Appearance (Frames & Shapes) (Priority: P2)

As a user, I want to apply decorative frames around my QR code and change its dot shapes (e.g., dotted style) so that it looks more attractive and encourages scanning.

**Why this priority**: Visual customization is key for branding and making the QR code stand out, which is a major value-add.

**Independent Test**: Can be tested by selecting a frame template and a dotted shape, then verifying the real-time SVG updates to reflect these visual changes.

**Acceptance Scenarios**:

1. **Given** the QR simulator is visible, **When** the user goes to the "Cadre" (Frame) tab, **Then** they see multiple frame templates, including rounded designs with customizable text at the bottom (e.g., "SCAN ME").
2. **Given** a frame is selected, **When** the user changes the "Texte du cadre" input, **Then** the text in the QR code frame updates instantly.
3. **Given** the simulator is visible, **When** the user goes to the "Forme" (Shape) tab, **Then** they can choose a dotted pattern ("pointillé") which alters the internal dots of the QR code.

---

### User Story 3 - Adding Custom Logos & Colors (Priority: P2)

As a user, I want to upload my own logo to the center of the QR code and apply custom colors (or gradients) so that it matches my brand identity.

**Why this priority**: Branding is crucial for professional users creating QR codes for marketing.

**Independent Test**: Can be tested by uploading an image, picking a primary color and gradient via the color picker, and verifying the QR code output remains scannable while displaying the branding.

**Acceptance Scenarios**:

1. **Given** the user is in the "Logo" tab, **When** they upload an image file, **Then** the logo is centered within the QR code.
2. **Given** the color picker tools, **When** the user selects a custom color or gradient, **Then** the QR code dots and frame instantly update to match the selected colors.

### Edge Cases

- What happens when the user uploads a very large logo? (It should be scaled down or cropped to fit the center without breaking scannability).
- What happens when a user types a very long Wi-Fi password or SSID? (The QR code complexity increases; the frame and layout should accommodate the denser code).
- What happens when a user types very long text for the frame? (The text should truncate or scale down to fit the frame's bottom section).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Wi-Fi configuration mode with inputs for SSID (text), Encryption (select: WEP, WPA/WPA2, None), Password (text/password), and Hidden Network (checkbox).
- **FR-002**: System MUST encode Wi-Fi credentials into the standard WIFI format for QR codes.
- **FR-003**: System MUST provide a "Cadre" (Frame) selection interface offering multiple frame templates (including rounded variants).
- **FR-004**: System MUST allow users to customize the text displayed within the frame (e.g., "SCAN ME") and its font (using a curated selection of Google Fonts).
- **FR-005**: System MUST provide a "Forme" (Shape) selection to change the pattern of the QR code dots, specifically including a dotted ("pointillé") style.
- **FR-006**: System MUST allow users to upload a custom logo file (PNG/JPG/SVG) to be displayed in the center of the QR code. All logo processing MUST happen client-side in the browser.
- **FR-007**: System MUST provide a color picker ("pipette") allowing users to choose solid colors for the QR code and frame.
- **FR-008**: System MUST allow users to configure color gradients for the QR code, supporting both linear and radial gradients.

### Key Entities

- **QR Configuration State**: Represents all real-time settings for the QR code (Data payload, Frame type, Frame text, Dot shape, Logo image, Colors, Gradient).
- **Wi-Fi Payload**: Represents the structured data needed for a Wi-Fi connection (SSID, Type, Password, Hidden).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully generate and scan a Wi-Fi QR code with a standard iOS/Android camera, connecting to the network instantly.
- **SC-002**: Visual customization (Frame, Shape, Logo, Colors) updates the QR code preview in less than 200ms after a change is made.
- **SC-003**: Custom logos do not break the scannability of the QR code (error correction level should automatically compensate).

## Assumptions

- Standard error correction level (e.g., Level H, 30%) is used automatically when a logo is applied to maintain scannability.
- The `qr-code-styling` library (already integrated) supports frames, custom shapes, logos, and gradients, making these features achievable mostly via configuration.
- Gradients will default to linear gradients if radial isn't explicitly requested by the user.
