# CodeTutor AI - Configuration Mobile avec Expo

Ce guide explique comment packager CodeTutor AI en applications natives pour iOS et Android en utilisant Expo et React Native.

## Prérequis

- Node.js 18+ et npm/pnpm
- Expo CLI: `npm install -g expo-cli`
- Pour iOS: macOS avec Xcode
- Pour Android: Android Studio et SDK
- Comptes développeur: Apple Developer et Google Play Console

## Installation d'Expo

```bash
# Installer Expo CLI globalement
npm install -g expo-cli

# Ou utiliser npx
npx expo@latest
```

## Configuration du projet React Native

### 1. Créer un nouveau projet Expo

```bash
cd /home/ubuntu
npx create-expo-app CodeTutorAI-Mobile
cd CodeTutorAI-Mobile
```

### 2. Installer les dépendances nécessaires

```bash
npm install expo-router expo-splash-screen expo-status-bar
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage
npm install react-native-webview
```

### 3. Configurer app.json pour Expo

```json
{
  "expo": {
    "name": "CodeTutor AI",
    "slug": "codetutor-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.codetutor.ai"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.codetutor.ai"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Build pour Android

### 1. Générer l'APK

```bash
# Build APK pour test
eas build --platform android --local

# Ou utiliser Expo Cloud Build
eas build --platform android
```

### 2. Générer l'AAB pour Google Play Store

```bash
eas build --platform android --release
```

### 3. Installer sur un appareil

```bash
# Après le build, télécharger l'APK
adb install CodeTutorAI.apk
```

## Build pour iOS

### 1. Générer l'IPA

```bash
# Build pour test
eas build --platform ios --local

# Ou utiliser Expo Cloud Build
eas build --platform ios
```

### 2. Générer pour App Store

```bash
eas build --platform ios --release
```

### 3. Tester sur simulateur

```bash
# Après le build, télécharger et installer sur le simulateur
xcrun simctl install booted CodeTutorAI.app
```

## Configuration EAS (Expo Application Services)

### 1. Créer un compte Expo

```bash
expo login
# ou
eas login
```

### 2. Initialiser EAS Build

```bash
eas build:configure
```

### 3. Configurer eas.json

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {
      "ios": {
        "buildType": "archive"
      }
    }
  }
}
```

## Publication sur les Stores

### Google Play Store

```bash
# Créer un compte Google Play Developer (25 USD)
# Générer une clé de signature
keytool -genkey -v -keystore ~/codetutor-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias codetutor

# Configurer dans eas.json et publier
eas submit --platform android
```

### Apple App Store

```bash
# Créer un compte Apple Developer (99 USD/an)
# Générer les certificats et provisioning profiles
eas submit --platform ios
```

## Commandes utiles

```bash
# Lancer en développement
expo start

# Lancer sur Android
expo start --android

# Lancer sur iOS
expo start --ios

# Lancer sur web
expo start --web

# Prévisualiser le build
eas build --platform android --preview

# Vérifier les certificats
eas credentials
```

## Intégration avec CodeTutor AI Web

Pour partager le code entre web et mobile :

1. Créer un dossier `shared` avec la logique commune
2. Utiliser des fichiers `.web.ts` et `.native.ts` pour les différences
3. Utiliser React Native Web pour certains composants

```typescript
// Example: shared/api.ts
export const fetchConversations = async (userId: number) => {
  // Logique commune
};

// Example: components/Button.web.tsx
export const Button = (props) => <button {...props} />;

// Example: components/Button.native.tsx
export const Button = (props) => <TouchableOpacity {...props} />;
```

## Troubleshooting

### Erreur de certificat iOS
```bash
eas credentials --platform ios
# Régénérer les certificats
```

### Erreur de clé de signature Android
```bash
# Vérifier la clé
keytool -list -v -keystore ~/codetutor-key.keystore
```

### Build échoue
```bash
# Nettoyer le cache
eas build --platform android --clear-cache

# Vérifier les logs
eas build:view
```

## Ressources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Connect](https://appstoreconnect.apple.com)
