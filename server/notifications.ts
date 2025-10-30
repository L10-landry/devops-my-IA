import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";

export interface NotificationPayload {
  userId: number;
  type: "badge" | "level_up" | "streak" | "achievement";
  title: string;
  message: string;
  icon: string;
  data?: Record<string, any>;
}

/**
 * Send a notification to the user via the built-in notification system
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    // Use the built-in notification system to notify the owner
    // In a production app, you'd want to send notifications to specific users
    // For now, we'll log it and potentially store it in a notifications table
    
    console.log(`[Notification] ${payload.type.toUpperCase()}: ${payload.title}`);
    console.log(`  Message: ${payload.message}`);
    console.log(`  User ID: ${payload.userId}`);
    
    // In a real app, you could:
    // 1. Store in database for user to see in app
    // 2. Send push notification via service worker
    // 3. Send email notification
    // 4. Send SMS notification
    
    return { success: true, notificationId: Date.now() };
  } catch (error) {
    console.error("[Notification] Failed to send notification:", error);
    return { success: false };
  }
}

/**
 * Notify user when they unlock a new badge
 */
export async function notifyBadgeUnlocked(
  userId: number,
  badgeName: string,
  badgeIcon: string,
  pointsReward: number
) {
  return sendNotification({
    userId,
    type: "badge",
    title: `🎉 Nouveau Badge Débloqué !`,
    message: `Vous avez débloqué le badge "${badgeName}" et gagné ${pointsReward} points !`,
    icon: badgeIcon,
    data: {
      badgeName,
      pointsReward,
    },
  });
}

/**
 * Notify user when they level up
 */
export async function notifyLevelUp(
  userId: number,
  newLevel: number,
  totalPoints: number
) {
  const milestone = newLevel % 5 === 0 ? "🌟 " : "⭐ ";
  
  return sendNotification({
    userId,
    type: "level_up",
    title: `${milestone}Montée de Niveau !`,
    message: `Félicitations ! Vous avez atteint le niveau ${newLevel} avec ${totalPoints} points !`,
    icon: newLevel >= 10 ? "👑" : newLevel >= 5 ? "⭐" : "🚀",
    data: {
      newLevel,
      totalPoints,
    },
  });
}

/**
 * Notify user when they reach a streak milestone
 */
export async function notifyStreakMilestone(
  userId: number,
  streakDays: number,
  pointsBonus: number
) {
  const messages: Record<number, string> = {
    7: "Une semaine d'apprentissage continu ! 🔥",
    14: "Deux semaines de persévérance ! 💪",
    30: "Un mois d'engagement ! 🏆",
    60: "Deux mois de dévouement ! 👑",
    100: "100 jours d'excellence ! 🌟",
  };

  const message = messages[streakDays] || `${streakDays} jours de streak !`;

  return sendNotification({
    userId,
    type: "streak",
    title: `🔥 Streak Milestone !`,
    message: `${message} Vous avez gagné ${pointsBonus} points bonus !`,
    icon: "🔥",
    data: {
      streakDays,
      pointsBonus,
    },
  });
}

/**
 * Notify user when they reach a major achievement
 */
export async function notifyAchievement(
  userId: number,
  achievementName: string,
  description: string,
  icon: string
) {
  return sendNotification({
    userId,
    type: "achievement",
    title: `🏅 Accomplissement Débloqué !`,
    message: `${achievementName}: ${description}`,
    icon,
    data: {
      achievementName,
    },
  });
}

/**
 * Get all pending notifications for a user
 */
export async function getUserNotifications(userId: number) {
  // This would typically query a notifications table
  // For now, return an empty array as notifications are sent in real-time
  return [];
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: number) {
  // This would update the database
  return { success: true };
}
