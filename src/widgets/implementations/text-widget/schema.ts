import { z } from 'zod';
export const TextWidgetSchema = z.object({
  content: z.string(),
});
