import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Code2, Sparkles, Zap, BookOpen, Target, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="animate-pulse text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">CodeTutor AI</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/learn">
                  <Button variant="ghost" className="text-white hover:text-purple-300">
                    Apprendre
                  </Button>
                </Link>
                <Link href="/editor">
                  <Button variant="ghost" className="text-white hover:text-purple-300">
                    Éditeur
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                    Tableau de bord
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Se connecter
                </Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Propulsé par l'Intelligence Artificielle</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Apprenez à coder avec
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> l'IA</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Un tuteur personnel qui vous guide ligne par ligne dans l'apprentissage de la programmation. 
            Supportant 9 langages, avec exécution de code en temps réel et explications détaillées.
          </p>

          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/learn">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
                    Commencer à apprendre
                  </Button>
                </Link>
                <Link href="/editor">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg px-8">
                    Ouvrir l'éditeur
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
                  Commencer gratuitement
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Pourquoi choisir CodeTutor AI ?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Explications ligne par ligne</CardTitle>
              <CardDescription className="text-gray-400">
                L'IA analyse votre code et explique chaque ligne en détail pour une compréhension parfaite
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Code2 className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Exécution en temps réel</CardTitle>
              <CardDescription className="text-gray-400">
                Testez votre code instantanément avec notre environnement d'exécution sécurisé
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">9 langages supportés</CardTitle>
              <CardDescription className="text-gray-400">
                Python, JavaScript, Java, C++, C, Go, Rust, PHP, Ruby - tout ce dont vous avez besoin
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Target className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Apprentissage personnalisé</CardTitle>
              <CardDescription className="text-gray-400">
                L'IA s'adapte à votre niveau et vous guide progressivement vers la maîtrise
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Suivi de progression</CardTitle>
              <CardDescription className="text-gray-400">
                Visualisez vos progrès et célébrez chaque étape de votre parcours d'apprentissage
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Tuteur IA disponible 24/7</CardTitle>
              <CardDescription className="text-gray-400">
                Posez vos questions à tout moment et obtenez des réponses instantanées et précises
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à commencer votre voyage ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'apprenants qui maîtrisent la programmation avec l'aide de l'IA
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8">
                Commencer maintenant
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 CodeTutor AI - Propulsé par Manus</p>
        </div>
      </footer>
    </div>
  );
}
