import { z } from 'zod';

// --- Text ---

export const TextSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
});

export type Text = z.infer<typeof TextSchema>;

export const CreateTextDtoSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export type CreateTextDto = z.infer<typeof CreateTextDtoSchema>;

// --- Translation ---

export const TranslationRequestSchema = z.object({
  text: z.string().min(1).max(500),
  langPair: z
    .string()
    .regex(/^[a-z]{2}\|[a-z]{2}$/)
    .default('en|ru'),
});

export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;

export const TranslationResponseSchema = z.object({
  translatedText: z.string(),
  originalText: z.string(),
  langPair: z.string(),
});

export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

// --- UserWord (Vocabulary) ---

export const UserWordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  textId: z.string().nullable(),
  word: z.string(),
  translation: z.string(),
  knowledgeLevel: z.number().int().min(0).max(5),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserWord = z.infer<typeof UserWordSchema>;

export const CreateUserWordDtoSchema = z.object({
  word: z.string().min(1).max(255),
  translation: z.string().min(1),
  knowledgeLevel: z.number().int().min(0).max(5).default(0),
  textId: z.string().optional(),
});

export type CreateUserWordDto = z.infer<typeof CreateUserWordDtoSchema>;

export const UpdateUserWordDtoSchema = z.object({
  translation: z.string().min(1).optional(),
  knowledgeLevel: z.number().int().min(0).max(5).optional(),
});

export type UpdateUserWordDto = z.infer<typeof UpdateUserWordDtoSchema>;

export const VocabularyResponseSchema = z.object({
  items: z.array(UserWordSchema),
  total: z.number().int().nonnegative(),
});

export type VocabularyResponse = z.infer<typeof VocabularyResponseSchema>;

// --- TextListResponse ---

export const TextListResponseSchema = z.object({
  items: z.array(TextSchema),
  total: z.number().int().nonnegative(),
});

export type TextListResponse = z.infer<typeof TextListResponseSchema>;
