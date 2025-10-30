import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  language?: string; // ISO 639-1 code (e.g., 'fr', 'en', 'es')
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function VoiceRecorder({
  onTranscript,
  language = "fr",
  variant = "outline",
  size = "icon",
  className = "",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Check for browser support
  const isBrowserSupported = () => {
    return (
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  };

  useEffect(() => {
    // Initialize Web Speech API if available
    if (isBrowserSupported()) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(language);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsRecording(false);
        toast.success("Transcription terminée");
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        
        if (event.error === "no-speech") {
          toast.error("Aucune parole détectée");
        } else if (event.error === "not-allowed") {
          toast.error("Accès au microphone refusé");
        } else {
          toast.error("Erreur de reconnaissance vocale");
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript]);

  // Map programming language to speech recognition language
  const getLanguageCode = (lang: string): string => {
    const languageMap: Record<string, string> = {
      python: "fr-FR",
      javascript: "fr-FR",
      java: "fr-FR",
      cpp: "fr-FR",
      c: "fr-FR",
      go: "fr-FR",
      rust: "fr-FR",
      php: "fr-FR",
      ruby: "fr-FR",
      fr: "fr-FR",
      en: "en-US",
      es: "es-ES",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-BR",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ar: "ar-SA",
      ru: "ru-RU",
    };

    return languageMap[lang] || "fr-FR";
  };

  const startRecording = async () => {
    if (!isBrowserSupported()) {
      toast.error("Votre navigateur ne supporte pas la reconnaissance vocale");
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsRecording(true);
      
      // Start Web Speech API recognition
      if (recognitionRef.current) {
        recognitionRef.current.lang = getLanguageCode(language);
        recognitionRef.current.start();
        toast.info("Parlez maintenant...");
      }

      // Also record audio for fallback
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Impossible d'accéder au microphone");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isBrowserSupported()) {
    return null; // Don't render if not supported
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleRecording}
      disabled={isProcessing}
      className={`${className} ${isRecording ? "text-red-500 animate-pulse" : ""}`}
      title={isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement vocal"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
