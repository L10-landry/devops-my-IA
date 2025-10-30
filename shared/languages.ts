export interface ProgrammingLanguage {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "#3776AB",
    description: "Langage polyvalent, idéal pour les débutants",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "#F7DF1E",
    description: "Le langage du web, pour le front et le back-end",
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "#007396",
    description: "Langage orienté objet, utilisé dans les entreprises",
  },
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    color: "#00599C",
    description: "Langage performant pour les systèmes et jeux",
  },
  {
    id: "c",
    name: "C",
    icon: "🔧",
    color: "#A8B9CC",
    description: "Langage de bas niveau, fondation de nombreux systèmes",
  },
  {
    id: "go",
    name: "Go",
    icon: "🔷",
    color: "#00ADD8",
    description: "Langage moderne pour les services backend",
  },
  {
    id: "rust",
    name: "Rust",
    icon: "🦀",
    color: "#CE422B",
    description: "Langage sûr et performant pour les systèmes",
  },
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "#777BB4",
    description: "Langage serveur pour le développement web",
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: "💎",
    color: "#CC342D",
    description: "Langage élégant pour le développement web",
  },
];

export function getLanguageById(id: string): ProgrammingLanguage | undefined {
  return PROGRAMMING_LANGUAGES.find(lang => lang.id === id);
}
