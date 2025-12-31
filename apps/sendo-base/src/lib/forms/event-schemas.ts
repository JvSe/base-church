import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  location: z.string().min(1, "Local é obrigatório"),
  type: z.enum(["online", "presential", "hybrid"], {
    required_error: "Tipo de evento é obrigatório",
  }),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  startTime: z.string().min(1, "Hora de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  endTime: z.string().min(1, "Hora de fim é obrigatória"),
  capacity: z
    .number()
    .min(1, "Capacidade deve ser maior que 0")
    .optional()
    .nullable(),
  tags: z.string().optional(),
  image: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

