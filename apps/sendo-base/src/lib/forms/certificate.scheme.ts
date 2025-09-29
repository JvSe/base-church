import { z } from "zod";

export const certificateSchema = z.object({
  courseId: z.string().min(1, "Curso é obrigatório"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  pdfBase64: z.string().optional(),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;
