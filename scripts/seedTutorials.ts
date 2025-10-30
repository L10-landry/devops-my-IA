import { drizzle } from "drizzle-orm/mysql2";
import { tutorials } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const tutorialsData = [
  // Python
  {
    language: "python",
    title: "Les bases de Python",
    description: "Apprenez les fondamentaux de Python : variables, types de données et opérations de base",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Variables et types",
          code: "# Variables en Python\nnom = \"Alice\"\nage = 25\ntaille = 1.75\nest_etudiant = True\n\nprint(f\"Je m'appelle {nom}, j'ai {age} ans\")",
          explanation: "Les variables en Python n'ont pas besoin de déclaration de type. Python détermine automatiquement le type.",
        },
        {
          title: "Opérations mathématiques",
          code: "# Opérations de base\na = 10\nb = 3\n\nprint(\"Addition:\", a + b)\nprint(\"Soustraction:\", a - b)\nprint(\"Multiplication:\", a * b)\nprint(\"Division:\", a / b)\nprint(\"Division entière:\", a // b)\nprint(\"Modulo:\", a % b)",
          explanation: "Python supporte toutes les opérations mathématiques de base et plus encore.",
        },
      ],
    }),
    orderIndex: 1,
  },
  {
    language: "python",
    title: "Structures de contrôle",
    description: "Maîtrisez les conditions et les boucles en Python",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Conditions if/else",
          code: "# Conditions\nage = 18\n\nif age >= 18:\n    print(\"Vous êtes majeur\")\nelse:\n    print(\"Vous êtes mineur\")",
          explanation: "Les conditions permettent d'exécuter du code selon certaines conditions.",
        },
        {
          title: "Boucle for",
          code: "# Boucle for\nfor i in range(5):\n    print(f\"Itération {i}\")\n\n# Parcourir une liste\nfruits = [\"pomme\", \"banane\", \"orange\"]\nfor fruit in fruits:\n    print(fruit)",
          explanation: "La boucle for permet de répéter des instructions un nombre défini de fois.",
        },
      ],
    }),
    orderIndex: 2,
  },

  // JavaScript
  {
    language: "javascript",
    title: "JavaScript pour débutants",
    description: "Découvrez les bases de JavaScript, le langage du web",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Variables et types",
          code: "// Variables en JavaScript\nconst nom = \"Alice\";\nlet age = 25;\nvar ancienneVariable = \"deprecated\";\n\nconsole.log(`Je m'appelle ${nom}, j'ai ${age} ans`);",
          explanation: "JavaScript utilise const pour les constantes, let pour les variables modifiables.",
        },
        {
          title: "Fonctions",
          code: "// Fonctions\nfunction saluer(nom) {\n    return `Bonjour ${nom}!`;\n}\n\n// Fonction fléchée\nconst multiplier = (a, b) => a * b;\n\nconsole.log(saluer(\"Alice\"));\nconsole.log(multiplier(5, 3));",
          explanation: "Les fonctions permettent de réutiliser du code. JavaScript supporte plusieurs syntaxes.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // Java
  {
    language: "java",
    title: "Introduction à Java",
    description: "Apprenez les concepts de base de la programmation orientée objet avec Java",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme Java",
          code: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Bonjour le monde!\");\n        \n        // Variables\n        String nom = \"Alice\";\n        int age = 25;\n        \n        System.out.println(\"Je m'appelle \" + nom);\n    }\n}",
          explanation: "Tout programme Java commence par une classe avec une méthode main.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // C++
  {
    language: "cpp",
    title: "C++ pour débutants",
    description: "Découvrez les bases du C++, un langage puissant et performant",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme C++",
          code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Bonjour le monde!\" << endl;\n    \n    // Variables\n    string nom = \"Alice\";\n    int age = 25;\n    \n    cout << \"Je m'appelle \" << nom << endl;\n    \n    return 0;\n}",
          explanation: "C++ utilise iostream pour les entrées/sorties et nécessite un return 0 dans main.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // Go
  {
    language: "go",
    title: "Go pour débutants",
    description: "Apprenez Go, le langage moderne de Google",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme Go",
          code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Bonjour le monde!\")\n    \n    // Variables\n    nom := \"Alice\"\n    age := 25\n    \n    fmt.Printf(\"Je m'appelle %s, j'ai %d ans\\n\", nom, age)\n}",
          explanation: "Go utilise := pour déclarer et initialiser des variables de manière concise.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // Rust
  {
    language: "rust",
    title: "Rust pour débutants",
    description: "Découvrez Rust, le langage sûr et performant",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme Rust",
          code: "fn main() {\n    println!(\"Bonjour le monde!\");\n    \n    // Variables\n    let nom = \"Alice\";\n    let age = 25;\n    \n    println!(\"Je m'appelle {}, j'ai {} ans\", nom, age);\n}",
          explanation: "Rust utilise let pour déclarer des variables et println! est une macro.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // PHP
  {
    language: "php",
    title: "PHP pour débutants",
    description: "Apprenez PHP, le langage serveur populaire",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme PHP",
          code: "<?php\n// Variables en PHP\n$nom = \"Alice\";\n$age = 25;\n\necho \"Bonjour le monde!\\n\";\necho \"Je m'appelle $nom, j'ai $age ans\\n\";\n?>",
          explanation: "PHP utilise $ pour les variables et echo pour afficher du texte.",
        },
      ],
    }),
    orderIndex: 1,
  },

  // Ruby
  {
    language: "ruby",
    title: "Ruby pour débutants",
    description: "Découvrez Ruby, le langage élégant et expressif",
    difficulty: "beginner" as const,
    content: JSON.stringify({
      lessons: [
        {
          title: "Premier programme Ruby",
          code: "# Variables en Ruby\nnom = \"Alice\"\nage = 25\n\nputs \"Bonjour le monde!\"\nputs \"Je m'appelle #{nom}, j'ai #{age} ans\"",
          explanation: "Ruby utilise puts pour afficher du texte et #{} pour l'interpolation de variables.",
        },
      ],
    }),
    orderIndex: 1,
  },
];

async function seedTutorials() {
  console.log("🌱 Génération des tutoriels...");

  try {
    for (const tutorial of tutorialsData) {
      await db.insert(tutorials).values(tutorial);
      console.log(`✓ Tutoriel créé: ${tutorial.title} (${tutorial.language})`);
    }

    console.log("\n✅ Tous les tutoriels ont été générés avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de la génération des tutoriels:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedTutorials();
