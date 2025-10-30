import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeData {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
}

interface BadgeDisplayProps {
  badges: BadgeData[];
  isLoading?: boolean;
}

export function BadgeDisplay({ badges, isLoading = false }: BadgeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/60">Chargement des badges...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🏆 Mes Badges ({badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-white/60 text-center py-8">
            Aucun badge pour le moment. Continuez à apprendre !
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-help">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="text-xs text-white/80 text-center line-clamp-2">
                      {badge.name}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{badge.pointsReward}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-sm">{badge.description}</p>
                    <p className="text-xs text-yellow-400">+{badge.pointsReward} points</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
