# 🎓 CodeTutor AI - Agent IA d'Apprentissage de Programmation

Un tuteur IA intelligent qui vous guide ligne par ligne dans l'apprentissage de **9 langages de programmation** avec exécution de code en temps réel, explications détaillées et gamification.

## ✨ Fonctionnalités Principales

### 🤖 Agent IA Interactif
- **Chat conversationnel** avec l'IA pour poser des questions
- **Explications ligne par ligne** du code avec contexte pédagogique
- **Support multi-langues** : Python, JavaScript, Java, C++, C, Go, Rust, PHP, Ruby

### 💻 Éditeur de Code Intégré
- Coloration syntaxique pour tous les langages supportés
- Exécution de code **en temps réel** côté serveur (sécurisé)
- Résultats instantanés avec gestion des erreurs
- Historique des exécutions

### 🎤 Reconnaissance Vocale
- Dictée de code via microphone
- Support multi-langues adaptatif
- Transcription en temps réel
- Intégration dans l'éditeur et le chat

### 🏆 Système de Gamification
- **Points** : 10 pts par exécution, 5 pts par question, 15 pts par snippet
- **Niveaux** : Progression automatique tous les 100 points
- **9 Badges** : First Steps, Code Master, Snippet Collector, etc.
- **Streaks** : Suivi des jours consécutifs d'apprentissage
- **Leaderboard** : Classement public des utilisateurs

### 📱 Gestion de Snippets
- Sauvegarde de code réutilisable
- Marquer les favoris
- Organisation par langage
- Partage facile

### 📊 Suivi de Progression
- Tableau de bord avec statistiques
- Historique des conversations
- Progression par langage
- Badges et accomplissements

### 🔔 Notifications en Temps Réel
- Alertes pour nouveaux badges
- Notifications de montée de niveau
- Milestones de streaks
- Toasts élégants avec animations

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- pnpm ou npm
- MySQL/TiDB

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/L10-landry/devops-my-IA.git
cd code_tutor_ai

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Pousser le schéma de base de données
pnpm db:push

# Démarrer le serveur de développement
pnpm dev
```

L'application sera disponible à `http://localhost:5173`

## 📦 Structure du Projet

```
code_tutor_ai/
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/         # Pages de l'application
│   │   ├── components/    # Composants réutilisables
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── lib/           # Utilitaires et configuration
│   └── public/            # Actifs statiques
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Procédures tRPC
│   ├── db.ts              # Requêtes de base de données
│   ├── gamification.ts    # Logique de gamification
│   ├── codeExecutor.ts    # Exécution sécurisée de code
│   └── notifications.ts   # Service de notifications
├── drizzle/               # Migrations de base de données
│   └── schema.ts          # Schéma Drizzle ORM
├── shared/                # Code partagé client-serveur
└── electron/              # Configuration Electron (Desktop)
```

## 🛠️ Technologies

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui Components
- tRPC pour l'API

**Backend:**
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB

**Authentification:**
- Manus OAuth

**Exécution de Code:**
- Python 3
- Node.js
- Java
- C++, C, Go, Rust, PHP, Ruby

## 📱 Plateforme Multi-Plateforme

### Web
- Déploiement sur Manus Platform
- Responsive design
- Progressive Web App

### Desktop (Electron)
- Windows (.exe, .msi)
- macOS (.dmg)
- Linux (.AppImage, .deb)

### Mobile (Expo)
- iOS (.ipa)
- Android (.apk)

Voir `PACKAGING_GUIDE.md` pour les instructions de build.

## 🔐 Sécurité

- Exécution de code **isolée** dans des conteneurs
- Authentification OAuth sécurisée
- Variables d'environnement protégées
- Validation des entrées utilisateur

## 📚 Documentation

- **PACKAGING_GUIDE.md** - Guide complet de packaging multi-plateforme
- **DESKTOP_BUILD.md** - Instructions pour les builds desktop
- **MOBILE_SETUP.md** - Configuration pour iOS/Android
- **userGuide.md** - Guide utilisateur

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**L10-landry** - Créateur et mainteneur principal

## 🙏 Remerciements

- Manus Platform pour l'infrastructure
- Communauté open-source pour les bibliothèques utilisées
- Tous les contributeurs

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter le support Manus

---

**Prêt à apprendre ? Commencez votre voyage avec CodeTutor AI ! 🚀**

[Voir le site en ligne](https://code-tutor-ai.manus.space)
