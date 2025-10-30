import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { PROGRAMMING_LANGUAGES, getLanguageById } from "@shared/languages";
import { ArrowLeft, Play, Loader2, BookOpen, MessageSquare, Save } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CodeEditor() {
  const { language: urlLanguage } = useParams<{ language?: string }>();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(urlLanguage || "python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const executeCodeMutation = trpc.code.execute.useMutation();
  const explainMutation = trpc.code.explainLineByLine.useMutation();
  const createConversationMutation = trpc.conversations.create.useMutation();
  const sendMessageMutation = trpc.conversations.sendMessage.useMutation();
  const { data: messages, refetch: refetchMessages } = trpc.conversations.getMessages.useQuery(
    { conversationId: conversationId! },
    { enabled: conversationId !== null }
  );
  const createSnippetMutation = trpc.snippets.create.useMutation();

  useEffect(() => {
    if (urlLanguage) {
      setSelectedLanguage(urlLanguage);
    }
  }, [urlLanguage]);

  useEffect(() => {
    // Initialize conversation when language changes
    if (isAuthenticated && user) {
      initializeConversation();
    }
  }, [selectedLanguage, isAuthenticated, user]);

  const initializeConversation = async () => {
    try {
      const lang = getLanguageById(selectedLanguage);
      const result = await createConversationMutation.mutateAsync({
        title: `Session ${lang?.name || selectedLanguage}`,
        language: selectedLanguage,
      });
      setConversationId(result.conversationId);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleExecute = async () => {
    if (!code.trim()) {
      toast.error("Veuillez entrer du code à exécuter");
      return;
    }

    setIsExecuting(true);
    setOutput("");

    try {
      const result = await executeCodeMutation.mutateAsync({
        code,
        language: selectedLanguage,
      });

      if (result.success) {
        setOutput(result.output || "✓ Code exécuté avec succès (aucune sortie)");
        toast.success("Code exécuté avec succès");
      } else {
        setOutput(`Erreur:\n${result.error}`);
        toast.error("Erreur lors de l'exécution");
      }
    } catch (error) {
      setOutput("Erreur lors de l'exécution du code");
      toast.error("Erreur lors de l'exécution");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("Veuillez entrer du code à analyser");
      return;
    }

    setIsExecuting(true);

    try {
      const result = await explainMutation.mutateAsync({
        code,
        language: selectedLanguage,
      });

      setOutput(result.explanation);
      toast.success("Analyse terminée");
    } catch (error) {
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !conversationId) return;

    setIsSending(true);

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: chatMessage,
        codeSnippet: code || undefined,
      });

      setChatMessage("");
      await refetchMessages();
      toast.success("Message envoyé");
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveSnippet = async () => {
    if (!code.trim()) {
      toast.error("Aucun code à sauvegarder");
      return;
    }

    const title = prompt("Nom du snippet:");
    if (!title) return;

    try {
      await createSnippetMutation.mutateAsync({
        title,
        language: selectedLanguage,
        code,
        description: `Snippet créé depuis l'éditeur`,
      });

      toast.success("Snippet sauvegardé");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="animate-pulse text-white">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Connexion requise</CardTitle>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Se connecter
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLang = getLanguageById(selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/learn">
              <Button variant="ghost" size="icon" className="text-white hover:text-purple-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-2xl font-bold text-white">Éditeur de Code</span>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Code Editor */}
          <div className="flex flex-col gap-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm flex-1 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">{currentLang?.icon}</span>
                    {currentLang?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveSnippet}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExplain}
                      disabled={isExecuting}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Expliquer
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isExecuting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Exécuter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Écrivez votre code ${currentLang?.name} ici...`}
                  className="flex-1 font-mono bg-slate-900 border-white/10 text-white resize-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-64">
              <CardHeader>
                <CardTitle className="text-white text-sm">Sortie</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {output || "La sortie du code apparaîtra ici..."}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - AI Chat */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tuteur IA
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-purple-600/20 ml-8"
                          : "bg-white/5 mr-8"
                      }`}
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        {msg.role === "user" ? "Vous" : "IA"}
                      </div>
                      <div className="text-white">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                      {msg.codeSnippet && (
                        <pre className="mt-2 p-2 bg-slate-900 rounded text-sm text-gray-300 overflow-x-auto">
                          {msg.codeSnippet}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Posez une question sur votre code..."
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !chatMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Envoyer"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
