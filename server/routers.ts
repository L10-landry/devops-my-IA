import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { executeCode, getSupportedLanguages } from "./codeExecutor";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Conversation management
  conversations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConversations(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        language: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversationId = await db.createConversation({
          userId: ctx.user.id,
          title: input.title,
          language: input.language,
        });
        return { conversationId };
      }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getConversationMessages(input.conversationId);
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string(),
        codeSnippet: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
          codeSnippet: input.codeSnippet,
        });

        // Get conversation history
        const messages = await db.getConversationMessages(input.conversationId);
        const conversation = (await db.getUserConversations(ctx.user.id)).find(
          c => c.id === input.conversationId
        );

        // Build LLM context
        const llmMessages = [
          {
            role: "system" as const,
            content: `Tu es CodeTutor AI, un assistant expert en programmation ${conversation?.language || ""}. 
            Ta mission est d'enseigner la programmation de manière interactive, ligne par ligne.
            - Explique chaque concept de façon claire et pédagogique
            - Fournis des exemples de code concrets
            - Analyse le code ligne par ligne quand demandé
            - Encourage l'apprentissage progressif
            - Réponds toujours en français
            - Sois patient et adapte-toi au niveau de l'apprenant`,
          },
          ...messages.slice(-10).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.codeSnippet ? `${m.content}\n\nCode:\n\`\`\`\n${m.codeSnippet}\n\`\`\`` : m.content,
          })),
        ];

        // Get AI response
        const aiResponse = await invokeLLM({
          messages: llmMessages,
        });

        const aiContent = typeof aiResponse.choices[0]?.message?.content === 'string' 
          ? aiResponse.choices[0].message.content 
          : "Désolé, je n'ai pas pu générer une réponse.";

        // Save AI response
        await db.createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: aiContent,
        });

        // Update conversation timestamp
        await db.updateConversationTimestamp(input.conversationId);

        return { content: aiContent };
      }),
  }),

  // Code execution
  code: router({
    execute: protectedProcedure
      .input(z.object({
        code: z.string(),
        language: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await executeCode(input.code, input.language);
        
        // Track code execution
        await db.incrementCodeExecutions(ctx.user.id, input.language);

        return result;
      }),

    supportedLanguages: publicProcedure.query(() => {
      return getSupportedLanguages();
    }),

    explainLineByLine: protectedProcedure
      .input(z.object({
        code: z.string(),
        language: z.string(),
      }))
      .mutation(async ({ input }) => {
        const lines = input.code.split("\n").filter(line => line.trim().length > 0);
        
        const prompt = `Analyse ce code ${input.language} ligne par ligne et explique chaque ligne en français de manière pédagogique:

\`\`\`${input.language}
${input.code}
\`\`\`

Format ta réponse comme suit:
Ligne 1: [code de la ligne]
Explication: [explication détaillée]

Ligne 2: [code de la ligne]
Explication: [explication détaillée]

etc.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Tu es un expert en programmation qui explique le code de manière claire et pédagogique.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const explanation = typeof response.choices[0]?.message?.content === 'string'
          ? response.choices[0].message.content
          : "Impossible de générer l'explication.";
        
        return { explanation };
      }),
  }),

  // Code snippets
  snippets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCodeSnippets(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        language: z.string(),
        code: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const snippetId = await db.createCodeSnippet({
          userId: ctx.user.id,
          title: input.title,
          language: input.language,
          code: input.code,
          description: input.description,
        });
        return { snippetId };
      }),

    toggleFavorite: protectedProcedure
      .input(z.object({ snippetId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.toggleCodeSnippetFavorite(input.snippetId, ctx.user.id);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ snippetId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCodeSnippet(input.snippetId, ctx.user.id);
        return { success: true };
      }),
  }),

  // User progress
  progress: router({
    get: protectedProcedure
      .input(z.object({ language: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserProgressByLanguage(ctx.user.id, input.language);
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      const languages = getSupportedLanguages();
      const progressData = await Promise.all(
        languages.map(async (lang) => ({
          language: lang,
          progress: await db.getUserProgressByLanguage(ctx.user.id, lang),
        }))
      );
      return progressData.filter(p => p.progress !== null);
    }),
  }),

  // Tutorials
  tutorials: router({
    getByLanguage: publicProcedure
      .input(z.object({ language: z.string() }))
      .query(async ({ input }) => {
        return await db.getTutorialsByLanguage(input.language);
      }),
  }),
});

export type AppRouter = typeof appRouter;
