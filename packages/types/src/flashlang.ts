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

// --- TextListResponse ---

export const TextListResponseSchema = z.object({
  items: z.array(TextSchema),
  total: z.number().int().nonnegative(),
});

export type TextListResponse = z.infer<typeof TextListResponseSchema>;
