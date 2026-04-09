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

export const TextListResponseSchema = z.object({
  items: z.array(TextSchema),
  total: z.number().int().nonnegative(),
});

export type TextListResponse = z.infer<typeof TextListResponseSchema>;
