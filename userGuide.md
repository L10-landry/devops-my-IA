# Guide Utilisateur - CodeTutor AI

## Informations générales

**Objectif** : CodeTutor AI est votre tuteur personnel d'IA qui vous guide ligne par ligne dans l'apprentissage de 9 langages de programmation avec exécution de code en temps réel.

**Accès** : Connexion requise via Manus OAuth

---

## Propulsé par Manus

CodeTutor AI utilise une stack technologique moderne et performante pour offrir une expérience d'apprentissage optimale :

**Frontend** : React 19 avec TypeScript, Tailwind CSS 4, et shadcn/ui pour une interface utilisateur réactive et élégante

**Backend** : Express 4 avec tRPC 11 pour une communication type-safe entre le client et le serveur, garantissant la fiabilité des échanges de données

**Base de données** : MySQL/TiDB avec Drizzle ORM pour un stockage structuré et performant de vos conversations, snippets et progression

**Intelligence Artificielle** : Intégration de modèles LLM avancés via l'API Manus Forge pour des explications pédagogiques personnalisées et contextuelles

**Exécution de code** : Environnement d'exécution sécurisé côté serveur supportant Python, JavaScript, Java, C++, C, Go, Rust, PHP et Ruby avec isolation complète

**Authentification** : Manus OAuth pour une connexion sécurisée et une gestion centralisée des utilisateurs

**Déploiement** : Infrastructure auto-scalable avec CDN global pour des temps de réponse rapides partout dans le monde

---

## Utiliser votre site web

### Démarrer l'apprentissage

Cliquez sur "Commencer à apprendre" depuis la page d'accueil. Vous accédez à la page de sélection des langages où vous pouvez choisir parmi 9 langages : Python 🐍, JavaScript ⚡, Java ☕, C++ ⚙️, C 🔧, Go 🔷, Rust 🦀, PHP 🐘 et Ruby 💎. Cliquez sur "Commencer" sous le langage de votre choix pour ouvrir l'éditeur interactif.

### Écrire et exécuter du code

Dans l'éditeur, tapez votre code dans la zone de texte principale ou utilisez l'icône micro en haut pour dicter votre code vocalement. La reconnaissance vocale s'adapte automatiquement au langage de programmation sélectionné. Cliquez sur "Exécuter" pour lancer l'exécution et voir le résultat dans la zone "Sortie" en dessous. Le code s'exécute de manière sécurisée sur le serveur avec un timeout de 10 secondes maximum.

### Obtenir des explications ligne par ligne

Après avoir écrit votre code, cliquez sur "Expliquer" pour recevoir une analyse détaillée de l'IA. Chaque ligne sera expliquée de manière pédagogique pour vous aider à comprendre le fonctionnement du code.

### Discuter avec le tuteur IA

Le panneau de droite dans l'éditeur contient le chat avec votre tuteur IA. Tapez vos questions dans le champ de texte et appuyez sur "Envoyer" ou la touche Entrée. Vous pouvez également cliquer sur l'icône micro pour poser vos questions vocalement. L'IA a accès à votre code actuel et peut répondre à vos questions de manière contextuelle. Toutes les conversations sont sauvegardées automatiquement.

### Sauvegarder vos snippets

Cliquez sur "Sauvegarder" dans l'éditeur pour enregistrer votre code. Entrez un nom descriptif lorsque demandé. Vos snippets sont accessibles via "Mes Snippets" dans la navigation. Vous pouvez marquer vos favoris avec l'étoile et supprimer les snippets avec l'icône corbeille.

### Suivre votre progression

Accédez au "Tableau de bord" pour visualiser vos statistiques : nombre d'exécutions de code, leçons complétées, snippets favoris et conversations. La section "Progression par langage" montre votre activité détaillée pour chaque langage avec la date de dernière activité.

---

## Gérer votre site web

### Paramètres généraux

Ouvrez le panneau de gestion via l'icône en haut à droite. Dans "Settings → General", vous pouvez modifier le nom et le logo de l'application affichés dans l'interface.

### Base de données

Le panneau "Database" dans l'interface de gestion vous permet de visualiser et modifier directement les données : utilisateurs, conversations, messages, snippets de code, progression et tutoriels. Les informations de connexion complètes sont disponibles dans les paramètres en bas à gauche (pensez à activer SSL).

### Tableau de bord et analytics

Le panneau "Dashboard" affiche les statistiques d'utilisation de votre site une fois publié, incluant les visiteurs uniques et les pages vues. Vous pouvez également gérer la visibilité du site depuis cette section.

### Prévisualisation

Le panneau "Preview" vous permet de tester l'application en temps réel pendant le développement. Les états de connexion sont persistants entre les sessions de prévisualisation.

---

## Prochaines étapes

Parlez à Manus AI à tout moment pour demander des modifications ou ajouter des fonctionnalités. Vous pouvez par exemple demander d'ajouter des exercices interactifs avec validation automatique, d'enrichir la bibliothèque de tutoriels, ou d'implémenter un système de badges et récompenses pour gamifier l'apprentissage.

Commencez dès maintenant votre voyage dans la programmation en cliquant sur "Apprendre" et choisissez votre premier langage !
