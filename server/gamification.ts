import { eq, and, gte } from "drizzle-orm";
import { getDb } from "./db";
import {
  userStats,
  userBadges,
  badges,
  dailyChallenges,
  userChallengeCompletions,
} from "../drizzle/schema";

const POINTS_PER_CODE_EXECUTION = 10;
const POINTS_PER_QUESTION = 5;
const POINTS_PER_SNIPPET = 15;
const POINTS_PER_LEVEL = 100;

export async function initializeUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db.insert(userStats).values({
      userId,
      totalPoints: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalCodeExecutions: 0,
      totalQuestionsAsked: 0,
      totalSnippetsSaved: 0,
    });

    return result;
  } catch (error) {
    console.error("[Gamification] Failed to initialize user stats:", error);
    return null;
  }
}

export async function addPoints(userId: number, points: number, reason: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      await initializeUserStats(userId);
    }

    const currentStats = stats[0] || (await initializeUserStats(userId));
    if (!currentStats) return null;

    const newPoints = (currentStats.totalPoints || 0) + points;
    const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1;

    const updated = await db
      .update(userStats)
      .set({
        totalPoints: newPoints,
        level: newLevel,
      })
      .where(eq(userStats.userId, userId));

    console.log(
      `[Gamification] Added ${points} points to user ${userId} (${reason})`
    );
    return { points: newPoints, level: newLevel };
  } catch (error) {
    console.error("[Gamification] Failed to add points:", error);
    return null;
  }
}

export async function recordCodeExecution(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      await initializeUserStats(userId);
    }

    await db
      .update(userStats)
      .set({
        totalCodeExecutions: (stats[0]?.totalCodeExecutions || 0) + 1,
      })
      .where(eq(userStats.userId, userId));

    await addPoints(userId, POINTS_PER_CODE_EXECUTION, "code_execution");
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error("[Gamification] Failed to record code execution:", error);
  }
}

export async function recordQuestion(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      await initializeUserStats(userId);
    }

    await db
      .update(userStats)
      .set({
        totalQuestionsAsked: (stats[0]?.totalQuestionsAsked || 0) + 1,
      })
      .where(eq(userStats.userId, userId));

    await addPoints(userId, POINTS_PER_QUESTION, "question_asked");
  } catch (error) {
    console.error("[Gamification] Failed to record question:", error);
  }
}

export async function recordSnippetSaved(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      await initializeUserStats(userId);
    }

    await db
      .update(userStats)
      .set({
        totalSnippetsSaved: (stats[0]?.totalSnippetsSaved || 0) + 1,
      })
      .where(eq(userStats.userId, userId));

    await addPoints(userId, POINTS_PER_SNIPPET, "snippet_saved");
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error("[Gamification] Failed to record snippet saved:", error);
  }
}

export async function updateStreak(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      await initializeUserStats(userId);
      return;
    }

    const currentStats = stats[0];
    const lastActivity = new Date(currentStats.lastActivityDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastActivity.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = currentStats.currentStreak || 0;
    let longestStreak = currentStats.longestStreak || 0;

    if (daysDiff === 0) {
      // Same day, no change
    } else if (daysDiff === 1) {
      // Consecutive day
      newStreak = (newStreak || 0) + 1;
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
    } else {
      // Streak broken
      newStreak = 1;
    }

    await db
      .update(userStats)
      .set({
        currentStreak: newStreak,
        longestStreak: longestStreak,
        lastActivityDate: new Date(),
      })
      .where(eq(userStats.userId, userId));

    if (newStreak > 0 && newStreak % 7 === 0) {
      await addPoints(userId, 50, `streak_${newStreak}_days`);
    }
  } catch (error) {
    console.error("[Gamification] Failed to update streak:", error);
  }
}

export async function checkAndAwardBadges(userId: number) {
  const db = await getDb();
  if (!db) return;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) return;

    const userStat = stats[0];
    const allBadges = await db.select().from(badges);

    for (const badge of allBadges) {
      const alreadyEarned = await db
        .select()
        .from(userBadges)
        .where(
          and(
            eq(userBadges.userId, userId),
            eq(userBadges.badgeId, badge.id)
          )
        )
        .limit(1);

      if (alreadyEarned.length > 0) continue;

      let shouldAward = false;

      switch (badge.criteria) {
        case "first_code":
          shouldAward = (userStat.totalCodeExecutions || 0) >= 1;
          break;
        case "code_master":
          shouldAward = (userStat.totalCodeExecutions || 0) >= 100;
          break;
        case "first_snippet":
          shouldAward = (userStat.totalSnippetsSaved || 0) >= 1;
          break;
        case "snippet_collector":
          shouldAward = (userStat.totalSnippetsSaved || 0) >= 50;
          break;
        case "curious_learner":
          shouldAward = (userStat.totalQuestionsAsked || 0) >= 10;
          break;
        case "level_5":
          shouldAward = (userStat.level || 0) >= 5;
          break;
        case "level_10":
          shouldAward = (userStat.level || 0) >= 10;
          break;
        case "streak_7":
          shouldAward = (userStat.currentStreak || 0) >= 7;
          break;
        case "streak_30":
          shouldAward = (userStat.longestStreak || 0) >= 30;
          break;
      }

      if (shouldAward) {
        await db.insert(userBadges).values({
          userId,
          badgeId: badge.id,
        });

        await addPoints(userId, badge.pointsReward, `badge_${badge.criteria}`);
        console.log(
          `[Gamification] User ${userId} earned badge: ${badge.name}`
        );
      }
    }
  } catch (error) {
    console.error("[Gamification] Failed to check badges:", error);
  }
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (stats.length === 0) {
      return await initializeUserStats(userId);
    }

    return stats[0];
  } catch (error) {
    console.error("[Gamification] Failed to get user stats:", error);
    return null;
  }
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const userBadgesList = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    const badgeIds = userBadgesList.map((ub) => ub.badgeId);
    if (badgeIds.length === 0) return [];

    const allBadges = await db.select().from(badges);
    const badgesList = allBadges.filter((b) => badgeIds.includes(b.id));

    return badgesList;
  } catch (error) {
    console.error("[Gamification] Failed to get user badges:", error);
    return [];
  }
}

export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const leaderboard = await db
      .select()
      .from(userStats)
      .orderBy((stats) => stats.totalPoints)
      .limit(limit);

    return leaderboard;
  } catch (error) {
    console.error("[Gamification] Failed to get leaderboard:", error);
    return [];
  }
}

export async function initializeBadges() {
  const db = await getDb();
  if (!db) return;

  try {
    const existingBadges = await db.select().from(badges);
    if (existingBadges.length > 0) return;

    const defaultBadges = [
      {
        name: "First Steps",
        description: "Execute your first code",
        icon: "🚀",
        criteria: "first_code",
        pointsReward: 10,
      },
      {
        name: "Code Master",
        description: "Execute 100 code snippets",
        icon: "🧠",
        criteria: "code_master",
        pointsReward: 100,
      },
      {
        name: "First Snippet",
        description: "Save your first code snippet",
        icon: "💾",
        criteria: "first_snippet",
        pointsReward: 10,
      },
      {
        name: "Snippet Collector",
        description: "Save 50 code snippets",
        icon: "📚",
        criteria: "snippet_collector",
        pointsReward: 100,
      },
      {
        name: "Curious Learner",
        description: "Ask 10 questions to the AI tutor",
        icon: "❓",
        criteria: "curious_learner",
        pointsReward: 50,
      },
      {
        name: "Rising Star",
        description: "Reach level 5",
        icon: "⭐",
        criteria: "level_5",
        pointsReward: 50,
      },
      {
        name: "Legend",
        description: "Reach level 10",
        icon: "👑",
        criteria: "level_10",
        pointsReward: 200,
      },
      {
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "🔥",
        criteria: "streak_7",
        pointsReward: 75,
      },
      {
        name: "Unstoppable",
        description: "Maintain a 30-day streak",
        icon: "💪",
        criteria: "streak_30",
        pointsReward: 300,
      },
    ];

    for (const badge of defaultBadges) {
      await db.insert(badges).values(badge);
    }

    console.log("[Gamification] Initialized default badges");
  } catch (error) {
    console.error("[Gamification] Failed to initialize badges:", error);
  }
}
