# secure-pass

# SecurePass — Generate Strong Passwords. Stay Secure.

![SecurePass Shield & Key Studio](https://img.shields.io/badge/SecurePass-v3.0.0-2563EB?style=for-the-badge&logo=shield&logoColor=white)
![WebCrypto CSPRNG Engine](https://img.shields.io/badge/Engine-WebCrypto_CSPRNG-06B6D4?style=for-the-badge)
![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero_Client_Side-10B981?style=for-the-badge)

**SecurePass** is a modern, premium cybersecurity SaaS web application engineered to generate cryptographically secure passwords, high-entropy EFF Diceware passphrases, quantum-resistant tokens, and PIN codes entirely client-side using browser-native WebCrypto (`crypto.getRandomValues()`).

---

## ✨ Features & Capabilities

- **Zero-Trust Client-Side Architecture**: All credential generation and entropy calculations happen 100% locally in your browser memory.
- **Multi-Mode Generation**:
  - **Password Mode (4–128 characters)**: Complete control over character sets (Uppercase, Lowercase, Numbers, Symbols), Exclude Similar (`i, l, 1, L, o, 0, O`), Exclude Ambiguous (`{}[]()/\'"\`~,;:.<>`), Custom Symbol Dictionary override, and **Pronounceable Syllables**.
  - **Passphrase Mode (EFF Diceware)**: High-entropy wordlist with custom delimiters (`-`, `_`, `.`, `Space`), Capitalization, and numeric salt injection.
  - **PIN Code Mode (3–16 digits)**: Numeric sequence generator.
  - **UUID v4 Mode**: RFC 4122 compliant cryptographic identifiers.
- **Real-Time Security Intelligence**:
  - Exact Shannon Entropy bits score.
  - GPU Array Brute-Force Crack Time estimation (`100B H/s`).
  - Actionable NIST SP 800-63B password recommendations.
- **Secure Sandbox Studio**: Export credentials formatted for `.env`, `JSON`, `YAML`, or Database `URI` strings.
- **Cryptographic Matrix Monitor**: Live high-performance visual canvas entropy monitor.
- **Vault History & Favorites**: Local storage vault with instant copy, search filtering, and TXT file export.
- **Air-Gapped QR Code Transfer**: Generate secure QR codes for instant mobile device transfer.

---

## 🎨 Brand & Aesthetics

- **Brand Name**: SecurePass
- **Tagline**: *"Generate Strong Passwords. Stay Secure."*
- **Primary Colors**: Blue (`#2563EB`), Violet (`#7C3AED`), Cyan (`#06B6D4`)
- **Theme**: Premium Cybersecurity SaaS with Glassmorphic UI

---

## 🚀 Getting Started

First, install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience **SecurePass**.

---

## 🛡️ License

Copyright © SecurePass Security. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
