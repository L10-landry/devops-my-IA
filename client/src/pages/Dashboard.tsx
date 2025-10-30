import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Code2, TrendingUp, BookOpen, Star, Zap } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLanguageById } from "@shared/languages";

export default function Dashboard() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { data: progressData } = trpc.progress.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: conversations } = trpc.conversations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: snippets } = trpc.snippets.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      window.location.href = "/";
    },
  });

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

  const totalExecutions = progressData?.reduce((sum, p) => sum + (p.progress?.totalCodeExecutions || 0), 0) || 0;
  const totalLessons = progressData?.reduce((sum, p) => sum + (p.progress?.lessonsCompleted || 0), 0) || 0;
  const favoriteSnippets = snippets?.filter(s => s.isFavorite).length || 0;

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
              <span className="text-2xl font-bold text-white">Tableau de bord</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
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
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Bienvenue, {user?.name || "Apprenant"} 👋
            </h1>
            <p className="text-gray-300">Voici un aperçu de votre progression</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-400">Exécutions de code</CardDescription>
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-400" />
                  {totalExecutions}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-400">Leçons complétées</CardDescription>
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                  {totalLessons}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-400">Snippets favoris</CardDescription>
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <Star className="h-6 w-6 text-purple-400" />
                  {favoriteSnippets}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-400">Conversations</CardDescription>
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  {conversations?.length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Progress by Language */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-12">
            <CardHeader>
              <CardTitle className="text-white">Progression par langage</CardTitle>
              <CardDescription className="text-gray-400">
                Votre activité dans chaque langage de programmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!progressData || progressData.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">Aucune progression enregistrée</p>
                  <Link href="/learn">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Commencer à apprendre
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressData.map((item) => {
                    const lang = getLanguageById(item.language);
                    const progress = item.progress;
                    if (!progress) return null;

                    return (
                      <div
                        key={item.language}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{lang?.icon}</span>
                          <div>
                            <h3 className="text-white font-semibold">{lang?.name}</h3>
                            <p className="text-sm text-gray-400">
                              Dernière activité: {new Date(progress.lastActivityAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {progress.totalCodeExecutions}
                            </div>
                            <div className="text-gray-400">Exécutions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {progress.lessonsCompleted}
                            </div>
                            <div className="text-gray-400">Leçons</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {progress.exercisesCompleted}
                            </div>
                            <div className="text-gray-400">Exercices</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/learn">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="text-white">Continuer l'apprentissage</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choisissez un langage et commencez à apprendre
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/editor">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full">
                <CardHeader>
                  <Code2 className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="text-white">Ouvrir l'éditeur</CardTitle>
                  <CardDescription className="text-gray-400">
                    Écrivez et exécutez du code avec l'aide de l'IA
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/snippets">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full">
                <CardHeader>
                  <Star className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="text-white">Mes snippets</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gérez vos extraits de code sauvegardés
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
