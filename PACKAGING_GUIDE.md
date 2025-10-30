# CodeTutor AI - Guide Complet de Packaging et Distribution

Ce guide couvre le packaging de CodeTutor AI pour toutes les plateformes : Web, Desktop (Windows/macOS/Linux) et Mobile (iOS/Android).

## Vue d'ensemble

| Plateforme | Format | Outil | Guide |
|-----------|--------|-------|-------|
| Web | Site web | Manus | Déployer via le bouton Publish |
| Windows | .exe / .msi | Electron + electron-builder | DESKTOP_BUILD.md |
| macOS | .dmg / .app | Electron + electron-builder | DESKTOP_BUILD.md |
| Linux | .AppImage / .deb | Electron + electron-builder | DESKTOP_BUILD.md |
| Android | .apk / .aab | Expo + EAS Build | MOBILE_SETUP.md |
| iOS | .ipa | Expo + EAS Build | MOBILE_SETUP.md |

## 1. Web (Plateforme Manus)

### Déployer sur le web

```bash
# Le site est déjà en ligne et accessible via :
# https://[votre-domaine].manus.space

# Pour publier les changements :
# 1. Créer un checkpoint via webdev_save_checkpoint
# 2. Cliquer sur le bouton "Publish" dans l'interface de gestion
```

## 2. Desktop (Electron)

### Prérequis

```bash
# Vérifier les dépendances
pnpm list electron electron-builder

# Installer si nécessaire
pnpm add -D electron electron-builder electron-is-dev
```

### Build rapide

```bash
# Windows
pnpm run electron-build-win

# macOS (sur macOS uniquement)
pnpm run electron-build-mac

# Linux
pnpm run electron-build-linux

# Tous les fichiers seront dans dist-electron/
```

### Résultats attendus

**Windows:**
- `CodeTutor AI Setup 1.0.0.exe` - Installeur NSIS
- `CodeTutor AI 1.0.0.exe` - Exécutable portable

**macOS:**
- `CodeTutor AI-1.0.0.dmg` - Installeur DMG
- `CodeTutor AI-1.0.0.zip` - Archive ZIP

**Linux:**
- `CodeTutor AI-1.0.0.AppImage` - Exécutable portable
- `code-tutor-ai_1.0.0_amd64.deb` - Paquet Debian

### Distribution Desktop

**Windows:**
- Microsoft Store
- Chocolatey: `choco install codetutor-ai`
- Winget: `winget install CodeTutorAI`
- GitHub Releases

**macOS:**
- Mac App Store
- Homebrew: `brew install codetutor-ai`
- GitHub Releases

**Linux:**
- Snap Store: `snap install codetutor-ai`
- Flathub
- AUR (Arch User Repository)
- GitHub Releases

## 3. Mobile (Expo)

### Prérequis

```bash
# Installer Expo CLI
npm install -g expo-cli

# Ou utiliser npx
npx expo@latest
```

### Créer le projet React Native

Voir le fichier `MOBILE_SETUP.md` pour les instructions détaillées.

### Build Android

```bash
# APK pour test
eas build --platform android --preview

# AAB pour Google Play Store
eas build --platform android --release
```

### Build iOS

```bash
# IPA pour test
eas build --platform ios --preview

# Pour App Store
eas build --platform ios --release
```

### Distribution Mobile

**Google Play Store:**
1. Créer un compte Google Play Developer (25 USD)
2. Générer une clé de signature
3. Uploader l'AAB
4. Remplir les informations de l'app
5. Soumettre pour révision

**Apple App Store:**
1. Créer un compte Apple Developer (99 USD/an)
2. Générer les certificats
3. Uploader l'IPA via Xcode ou Transporter
4. Remplir les informations de l'app
5. Soumettre pour révision

## Processus de Release

### 1. Préparer la version

```bash
# Mettre à jour la version
# Dans package.json: "version": "1.1.0"
# Dans electron-builder.json: même version
# Dans app.json (Expo): même version

# Tester localement
pnpm run electron-dev
```

### 2. Créer les builds

```bash
# Web - créer un checkpoint
pnpm run build
# Puis cliquer Publish

# Desktop - tous les formats
pnpm run electron-build-win
pnpm run electron-build-mac
pnpm run electron-build-linux

# Mobile
eas build --platform android --release
eas build --platform ios --release
```

### 3. Tester les builds

```bash
# Windows: Installer et tester l'exe
# macOS: Ouvrir le dmg et tester l'app
# Linux: Lancer l'AppImage
# Android: Installer l'APK sur un appareil
# iOS: Installer l'IPA via TestFlight
```

### 4. Publier

```bash
# Créer une release GitHub
gh release create v1.1.0 dist-electron/*

# Ou publier manuellement sur les stores
# Voir les sections Web, Desktop, Mobile ci-dessus
```

## Checklist de Release

- [ ] Mettre à jour la version dans tous les fichiers
- [ ] Mettre à jour le changelog
- [ ] Tester sur toutes les plateformes
- [ ] Créer les builds
- [ ] Tester les builds
- [ ] Signer les applications (si nécessaire)
- [ ] Publier sur les stores
- [ ] Annoncer la nouvelle version
- [ ] Créer une release GitHub

## Certificats et Signatures

### Windows

```bash
# Créer un certificat auto-signé
# Ou acheter un certificat de signature de code
# Configurer dans electron-builder.json:
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "password"
}
```

### macOS

```bash
# Exporter le certificat depuis Keychain
security find-identity -v -p codesigning

# Configurer dans electron-builder.json:
"mac": {
  "identity": "Developer ID Application: Your Name (XXXXXXXXXX)"
}
```

### iOS/Android

```bash
# Générer les clés dans Expo
eas credentials
```

## Troubleshooting

### Le build échoue

```bash
# Nettoyer et reconstruire
rm -rf dist-electron node_modules
pnpm install
pnpm run electron-build-win
```

### L'app ne démarre pas

```bash
# Vérifier les logs
# Windows: %APPDATA%\CodeTutor AI\logs
# macOS: ~/Library/Logs/CodeTutor AI
# Linux: ~/.config/CodeTutor AI/logs

# Lancer en développement
pnpm run electron-dev
```

### Erreur de signature

```bash
# Vérifier les certificats
# Windows: certmgr.msc
# macOS: Keychain Access

# Régénérer si nécessaire
eas credentials --platform ios
eas credentials --platform android
```

## Ressources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

## Support

Pour toute question ou problème :
- Consulter les guides spécifiques (DESKTOP_BUILD.md, MOBILE_SETUP.md)
- Vérifier la documentation officielle des outils
- Contacter le support Manus via https://help.manus.im
