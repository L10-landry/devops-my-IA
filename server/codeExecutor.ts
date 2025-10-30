import { spawn } from "child_process";

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

const TIMEOUT_MS = 10000; // 10 seconds timeout
const MAX_OUTPUT_LENGTH = 10000; // Limit output size

const LANGUAGE_CONFIGS: Record<string, { command: string; args: (file: string) => string[]; extension: string }> = {
  python: {
    command: "python3",
    args: (file) => [file],
    extension: "py",
  },
  javascript: {
    command: "node",
    args: (file) => [file],
    extension: "js",
  },
  java: {
    command: "java",
    args: (file) => [file],
    extension: "java",
  },
  cpp: {
    command: "g++",
    args: (file) => [file, "-o", "/tmp/cpp_output", "&&", "/tmp/cpp_output"],
    extension: "cpp",
  },
  c: {
    command: "gcc",
    args: (file) => [file, "-o", "/tmp/c_output", "&&", "/tmp/c_output"],
    extension: "c",
  },
  go: {
    command: "go",
    args: (file) => ["run", file],
    extension: "go",
  },
  rust: {
    command: "rustc",
    args: (file) => [file, "-o", "/tmp/rust_output", "&&", "/tmp/rust_output"],
    extension: "rs",
  },
  php: {
    command: "php",
    args: (file) => [file],
    extension: "php",
  },
  ruby: {
    command: "ruby",
    args: (file) => [file],
    extension: "rb",
  },
};

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Validate language support
  const config = LANGUAGE_CONFIGS[language.toLowerCase()];
  if (!config) {
    return {
      success: false,
      output: "",
      error: `Langage non supporté: ${language}. Langages disponibles: ${Object.keys(LANGUAGE_CONFIGS).join(", ")}`,
      executionTime: 0,
    };
  }

  // Create temporary file
  const tmpFile = `/tmp/code_${Date.now()}_${Math.random().toString(36).substring(7)}.${config.extension}`;
  
  try {
    // Write code to temporary file
    const fs = await import("fs/promises");
    await fs.writeFile(tmpFile, code, "utf-8");

    // Execute code
    const result = await runCommand(config.command, config.args(tmpFile));
    
    // Clean up
    try {
      await fs.unlink(tmpFile);
    } catch (e) {
      // Ignore cleanup errors
    }

    const executionTime = Date.now() - startTime;

    return {
      success: result.exitCode === 0,
      output: result.stdout.substring(0, MAX_OUTPUT_LENGTH),
      error: result.exitCode !== 0 ? result.stderr.substring(0, MAX_OUTPUT_LENGTH) : undefined,
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Erreur d'exécution inconnue",
      executionTime: Date.now() - startTime,
    };
  }
}

interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function runCommand(command: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    const process = spawn(command, args, {
      timeout: TIMEOUT_MS,
      shell: true,
    });

    process.stdout.on("data", (data) => {
      stdout += data.toString();
      if (stdout.length > MAX_OUTPUT_LENGTH) {
        process.kill();
        stderr += "\n[Sortie tronquée - limite de taille dépassée]";
      }
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
      if (stderr.length > MAX_OUTPUT_LENGTH) {
        process.kill();
        stderr += "\n[Erreur tronquée - limite de taille dépassée]";
      }
    });

    process.on("close", (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 1,
      });
    });

    process.on("error", (error) => {
      resolve({
        stdout,
        stderr: stderr + "\n" + error.message,
        exitCode: 1,
      });
    });

    setTimeout(() => {
      if (!process.killed) {
        process.kill();
        stderr += "\n[Timeout - exécution interrompue après 10 secondes]";
      }
    }, TIMEOUT_MS);
  });
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CONFIGS);
}

export function analyzeCodeLineByLine(code: string, language: string): string[] {
  const lines = code.split("\n");
  const analysis: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      analysis.push(`Ligne ${index + 1}: Ligne vide`);
    } else if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      analysis.push(`Ligne ${index + 1}: Commentaire - ${trimmed}`);
    } else {
      analysis.push(`Ligne ${index + 1}: ${trimmed}`);
    }
  });

  return analysis;
}
