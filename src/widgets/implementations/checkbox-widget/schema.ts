import { z } from 'zod';

export const CheckboxWidgetSchema = z.object({
  title: z.string(),
  checkboxes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      checked: z.boolean(),
    })
  ),
});

export type CheckboxWidgetData = z.infer<typeof CheckboxWidgetSchema>;
