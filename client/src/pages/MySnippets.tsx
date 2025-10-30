import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Star, Trash2, Code2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLanguageById } from "@shared/languages";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MySnippets() {
  const { isAuthenticated, loading } = useAuth();
  const { data: snippets, refetch } = trpc.snippets.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const toggleFavoriteMutation = trpc.snippets.toggleFavorite.useMutation();
  const deleteSnippetMutation = trpc.snippets.delete.useMutation();

  const handleToggleFavorite = async (snippetId: number) => {
    try {
      await toggleFavoriteMutation.mutateAsync({ snippetId });
      await refetch();
      toast.success("Favori mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (snippetId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce snippet ?")) return;

    try {
      await deleteSnippetMutation.mutateAsync({ snippetId });
      await refetch();
      toast.success("Snippet supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

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
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Mes Snippets</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mes Snippets de Code</h1>
            <p className="text-gray-300">
              Gérez vos extraits de code sauvegardés
            </p>
          </div>

          {!snippets || snippets.length === 0 ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Code2 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">Aucun snippet sauvegardé</p>
                <Link href="/editor">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Créer un snippet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {snippets.map((snippet) => {
                const lang = getLanguageById(snippet.language);
                return (
                  <Card
                    key={snippet.id}
                    className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{lang?.icon}</span>
                            <CardTitle className="text-white">{snippet.title}</CardTitle>
                          </div>
                          <CardDescription className="text-gray-400">
                            {lang?.name} • {new Date(snippet.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleFavorite(snippet.id)}
                            className={snippet.isFavorite ? "text-yellow-400" : "text-gray-400"}
                          >
                            <Star className="h-4 w-4" fill={snippet.isFavorite ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(snippet.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {snippet.description && (
                        <p className="text-gray-300 text-sm mb-3">{snippet.description}</p>
                      )}
                      <ScrollArea className="h-48 rounded bg-slate-900 p-3">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                          {snippet.code}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
