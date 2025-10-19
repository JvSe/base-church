import { z } from "zod";

export const completeSignupSchema = z
  .object({
    token: z.string().min(1, "Token inválido"),
    cpf: z
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido")
      .refine(
        (cpf) => {
          // Remove caracteres não numéricos
          const cleanCpf = cpf.replace(/\D/g, "");
          return cleanCpf.length === 11;
        },
        { message: "CPF deve ter 11 dígitos" },
      ),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CompleteSignupScheme = z.infer<typeof completeSignupSchema>;
