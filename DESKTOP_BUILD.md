# CodeTutor AI - Build Desktop avec Electron

Ce guide explique comment packager CodeTutor AI en exécutables pour Windows, macOS et Linux.

## Prérequis

- Node.js 18+ et pnpm
- Pour Windows: Visual Studio Build Tools
- Pour macOS: Xcode et certificats de signature
- Pour Linux: build-essential

## Installation des dépendances

Les dépendances Electron sont déjà installées. Vérifiez avec :

```bash
cd /home/ubuntu/code_tutor_ai
pnpm list electron electron-builder
```

## Structure du projet Electron

```
electron/
├── main.ts          # Processus principal
├── preload.ts       # Script de préchargement
├── assets/          # Icônes et ressources
│   ├── icon.png
│   ├── icon.icns
│   └── icon.ico
└── entitlements.mac.plist  # Configuration macOS
```

## Build pour Windows

### 1. Installer les outils de build (première fois)

```bash
# Sur Windows avec Visual Studio Build Tools
npm install --global windows-build-tools

# Ou installer Visual Studio Community avec les outils C++
```

### 2. Générer l'exécutable

```bash
# Build NSIS Installer (.exe)
pnpm run electron-build-win

# Ou build portable
pnpm run electron-build -- --win portable
```

### 3. Résultat

Les fichiers seront dans `dist-electron/`:
- `CodeTutor AI Setup 1.0.0.exe` - Installeur
- `CodeTutor AI 1.0.0.exe` - Exécutable portable

## Build pour macOS

### 1. Configuration des certificats

```bash
# Créer un certificat de développement
# Aller sur https://developer.apple.com/account/

# Exporter le certificat en .p12
# Placer dans electron/certs/

# Configurer dans electron-builder.json
# "certificateFile": "electron/certs/certificate.p12",
# "certificatePassword": "votre_mot_de_passe"
```

### 2. Générer l'application

```bash
# Sur macOS uniquement
pnpm run electron-build-mac
```

### 3. Résultat

Les fichiers seront dans `dist-electron/`:
- `CodeTutor AI-1.0.0.dmg` - Installeur DMG
- `CodeTutor AI-1.0.0.zip` - Archive ZIP

### 4. Notarisation (optionnel mais recommandé)

```bash
# Notariser l'app pour macOS Catalina+
xcrun altool --notarize-app \
  -f "dist-electron/CodeTutor AI-1.0.0.dmg" \
  -t osx \
  -u "votre@email.com" \
  -p "votre_mot_de_passe_app"
```

## Build pour Linux

### 1. Installer les dépendances

```bash
# Ubuntu/Debian
sudo apt-get install -y build-essential libx11-dev libxext-dev libxss-dev libxkbfile-dev

# Fedora
sudo dnf install -y gcc-c++ make libX11-devel libXext-devel libXss-devel libxkbfile-devel

# Arch
sudo pacman -S base-devel libx11 libxext libxss libxkbfile
```

### 2. Générer les exécutables

```bash
# Build AppImage et deb
pnpm run electron-build-linux
```

### 3. Résultat

Les fichiers seront dans `dist-electron/`:
- `CodeTutor AI-1.0.0.AppImage` - Exécutable portable
- `code-tutor-ai_1.0.0_amd64.deb` - Paquet Debian

## Build multi-plateforme

### Sur Windows

```bash
# Windows uniquement
pnpm run electron-build-win
```

### Sur macOS

```bash
# macOS uniquement
pnpm run electron-build-mac
```

### Sur Linux

```bash
# Linux uniquement
pnpm run electron-build-linux
```

### Build universel (macOS Intel + Apple Silicon)

```bash
# Dans electron-builder.json, ajouter:
"mac": {
  "target": ["universal", "dmg"],
  "universal": {
    "archs": ["x64", "arm64"]
  }
}

pnpm run electron-build-mac
```

## Configuration avancée

### Personnaliser l'icône

1. Préparer les images:
   - Windows: `icon.ico` (256x256)
   - macOS: `icon.icns` (512x512)
   - Linux: `icon.png` (512x512)

2. Placer dans `electron/assets/`

3. Configurer dans `electron-builder.json`:

```json
{
  "win": {
    "icon": "electron/assets/icon.ico"
  },
  "mac": {
    "icon": "electron/assets/icon.icns"
  },
  "linux": {
    "icon": "electron/assets/icon.png"
  }
}
```

### Signer les applications

#### Windows

```bash
# Obtenir un certificat de signature de code
# Configurer dans electron-builder.json:
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "password",
  "signingHashAlgorithms": ["sha256"]
}
```

#### macOS

```bash
# Exporter le certificat depuis Keychain
security find-identity -v -p codesigning

# Configurer dans electron-builder.json:
"mac": {
  "identity": "Developer ID Application: Your Name (XXXXXXXXXX)"
}
```

### Auto-update

Ajouter dans `electron/main.ts`:

```typescript
import { autoUpdater } from "electron-updater";

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## Commandes utiles

```bash
# Build et lancer en développement
pnpm run electron-dev

# Build production
pnpm run electron-build

# Build pour une plateforme spécifique
pnpm run electron-build-win
pnpm run electron-build-mac
pnpm run electron-build-linux

# Nettoyer les builds précédents
rm -rf dist-electron

# Vérifier la configuration
cat electron-builder.json
```

## Distribution

### GitHub Releases

```bash
# Créer une release sur GitHub
gh release create v1.0.0 dist-electron/*

# Ou manuellement uploader les fichiers
```

### Autres plateformes

- **Windows**: Microsoft Store, Chocolatey, Winget
- **macOS**: Mac App Store, Homebrew
- **Linux**: Snap Store, Flathub, AUR

## Troubleshooting

### Erreur: "Cannot find module 'electron'"

```bash
pnpm install
pnpm add -D electron
```

### Erreur de signature (macOS)

```bash
# Vérifier les certificats disponibles
security find-identity -v -p codesigning

# Régénérer les certificats
# Aller sur https://developer.apple.com/account/
```

### Erreur de build Windows

```bash
# Installer les outils de build
npm install --global windows-build-tools

# Ou installer Visual Studio Build Tools
# https://visualstudio.microsoft.com/downloads/
```

### L'app ne démarre pas

```bash
# Vérifier les logs
# Windows: %APPDATA%\CodeTutor AI\logs
# macOS: ~/Library/Logs/CodeTutor AI
# Linux: ~/.config/CodeTutor AI/logs

# Lancer en développement pour voir les erreurs
pnpm run electron-dev
```

## Ressources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Auto Update](https://www.electron.build/auto-update)
