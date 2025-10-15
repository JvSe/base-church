import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  instructorId: z.string().min(1, "Instrutor é obrigatório"),
  duration: z.number().min(1, "Duração deve ser maior que 0").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Nível é obrigatório",
  }),
  category: z.string().min(1, "Categoria é obrigatória"),
  tags: z.string().optional(),
  price: z.number().min(0, "Preço não pode ser negativo"),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// ========================================
// MODULE SCHEMA
// ========================================

export const moduleSchema = z.object({
  title: z.string().min(1, "Título do módulo é obrigatório"),
  description: z.string().min(1, "Descrição do módulo é obrigatória"),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;

// ========================================
// LESSON SCHEMA
// ========================================

export const lessonSchema = z.object({
  title: z.string().min(1, "Título da lição é obrigatório"),
  description: z.string().min(1, "Descrição da lição é obrigatória"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  youtubeEmbedId: z.string().optional(),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  order: z.number().optional(),
  type: z.enum(["VIDEO", "TEXT", "OBJECTIVE_QUIZ", "SUBJECTIVE_QUIZ"], {
    required_error: "Tipo é obrigatório",
  }),
  isActivity: z.boolean().optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

// ========================================
// CERTIFICATE TEMPLATE SCHEMA
// ========================================

export const certificateTemplateSchema = z.object({
  title: z.string().min(1, "Título do certificado é obrigatório"),
  description: z.string().min(1, "Descrição do certificado é obrigatória"),
  pdfFile: z.any().optional(),
});

export type CertificateTemplateFormData = z.infer<
  typeof certificateTemplateSchema
>;

// ========================================
// QUESTION SCHEMA
// ========================================

export const questionSchema = z.object({
  questionText: z.string().min(1, "Texto da questão é obrigatório"),
  points: z.number().min(1, "Pontuação deve ser maior que 0").optional(),
  explanation: z.string().optional(),
  type: z.enum(["objective", "subjective"]),
  subjectiveAnswerType: z.enum(["text", "file"]).optional(),
  correctAnswer: z.string().optional(),
  options: z
    .array(
      z.object({
        optionText: z.string().min(1, "Texto da opção é obrigatório"),
        isCorrect: z.boolean(),
      }),
    )
    .optional(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
