import { z } from "zod";

export const trackSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  image: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  objectives: z.string().optional(),
  requirements: z.string().optional(),
});

export const trackCourseSchema = z.object({
  courseId: z.string().min(1, "Selecione um curso"),
  order: z.number().min(0),
  isRequired: z.boolean().default(true),
});

export type TrackFormData = z.infer<typeof trackSchema>;
export type TrackCourseFormData = z.infer<typeof trackCourseSchema>;

