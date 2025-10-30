import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { PROGRAMMING_LANGUAGES } from "@shared/languages";
import { ArrowLeft, Code2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Learn() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
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
            <CardDescription className="text-gray-400">
              Vous devez être connecté pour accéder à l'apprentissage
            </CardDescription>
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

  const handleLanguageSelect = (languageId: string) => {
    setLocation(`/editor/${languageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:text-purple-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">CodeTutor AI</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/snippets">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Mes Snippets
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                Tableau de bord
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choisissez votre langage
            </h1>
            <p className="text-xl text-gray-300">
              Sélectionnez le langage de programmation que vous souhaitez apprendre
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <Card
                key={lang.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => handleLanguageSelect(lang.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{lang.icon}</span>
                    <CardTitle className="text-white text-2xl">{lang.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    {lang.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-500"
                    style={{ borderColor: lang.color }}
                  >
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
