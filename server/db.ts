import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  conversations, 
  messages, 
  codeSnippets, 
  userProgress, 
  tutorials,
  InsertConversation,
  InsertMessage,
  InsertCodeSnippet,
  InsertUserProgress,
  InsertTutorial
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Conversation queries
export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversations).values(data);
  return result[0].insertId;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(data);
  return result[0].insertId;
}

export async function updateConversationTimestamp(conversationId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

// Code snippet queries
export async function getUserCodeSnippets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(codeSnippets)
    .where(eq(codeSnippets.userId, userId))
    .orderBy(desc(codeSnippets.updatedAt));
}

export async function createCodeSnippet(data: InsertCodeSnippet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(codeSnippets).values(data);
  return result[0].insertId;
}

export async function toggleCodeSnippetFavorite(snippetId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const snippet = await db
    .select()
    .from(codeSnippets)
    .where(and(eq(codeSnippets.id, snippetId), eq(codeSnippets.userId, userId)))
    .limit(1);
  
  if (snippet.length === 0) throw new Error("Snippet not found");
  
  await db
    .update(codeSnippets)
    .set({ isFavorite: !snippet[0].isFavorite })
    .where(eq(codeSnippets.id, snippetId));
}

export async function deleteCodeSnippet(snippetId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(codeSnippets)
    .where(and(eq(codeSnippets.id, snippetId), eq(codeSnippets.userId, userId)));
}

// User progress queries
export async function getUserProgressByLanguage(userId: number, language: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.language, language)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function upsertUserProgress(data: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userProgress).values(data).onDuplicateKeyUpdate({
    set: {
      lessonsCompleted: data.lessonsCompleted,
      exercisesCompleted: data.exercisesCompleted,
      totalCodeExecutions: data.totalCodeExecutions,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function incrementCodeExecutions(userId: number, language: string) {
  const db = await getDb();
  if (!db) return;
  
  const progress = await getUserProgressByLanguage(userId, language);
  
  if (progress) {
    await db
      .update(userProgress)
      .set({ 
        totalCodeExecutions: progress.totalCodeExecutions + 1,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.language, language)));
  } else {
    await db.insert(userProgress).values({
      userId,
      language,
      totalCodeExecutions: 1,
      lessonsCompleted: 0,
      exercisesCompleted: 0,
    });
  }
}

// Tutorial queries
export async function getTutorialsByLanguage(language: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(tutorials)
    .where(eq(tutorials.language, language))
    .orderBy(tutorials.orderIndex);
}

export async function createTutorial(data: InsertTutorial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tutorials).values(data);
  return result[0].insertId;
}
