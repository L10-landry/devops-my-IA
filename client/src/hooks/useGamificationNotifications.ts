import { useCallback } from "react";
import { triggerNotification } from "@/components/NotificationToast";
import { trpc } from "@/lib/trpc";

/**
 * Hook to handle gamification notifications
 * Triggers notifications when user earns badges, levels up, or reaches streaks
 */
export function useGamificationNotifications() {
  const { data: stats } = trpc.gamification.getStats.useQuery();
  const { data: badges } = trpc.gamification.getBadges.useQuery();

  const notifyCodeExecution = useCallback(async () => {
    try {
      const mutation = trpc.gamification.recordCodeExecution.useMutation();
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error recording code execution:", error);
    }
  }, []);

  const notifyQuestion = useCallback(async () => {
    try {
      const mutation = trpc.gamification.recordQuestion.useMutation();
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error recording question:", error);
    }
  }, []);

  const notifySnippetSaved = useCallback(async () => {
    try {
      const mutation = trpc.gamification.recordSnippetSaved.useMutation();
      await mutation.mutateAsync();
      
      triggerNotification({
        type: "achievement",
        title: "💾 Snippet Sauvegardé !",
        message: "Vous avez gagné des points pour avoir sauvegardé du code.",
        icon: "💾",
      });
    } catch (error) {
      console.error("Error recording snippet saved:", error);
    }
  }, []);

  return {
    notifyCodeExecution,
    notifyQuestion,
    notifySnippetSaved,
    currentStats: stats || null,
    userBadges: badges || [],
  };
}
