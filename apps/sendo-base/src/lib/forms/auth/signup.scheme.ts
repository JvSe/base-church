import { z } from "zod";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nome é obrigatório" })
      .min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    cpf: z
      .string()
      .min(1, { message: "CPF é obrigatório" })
      .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
        message: "CPF deve ter o formato 000.000.000-00",
      }),
    password: z
      .string()
      .min(1, { message: "Senha é obrigatória" })
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    // .regex(/[A-Z]/, {
    //   message: "Senha deve conter pelo menos uma letra maiúscula",
    // })
    // .regex(/[a-z]/, {
    //   message: "Senha deve conter pelo menos uma letra minúscula",
    // })
    // .regex(/\d/, { message: "Senha deve conter pelo menos um número" })
    // .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    //   message: "Senha deve conter pelo menos um caractere especial",
    // }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpScheme = z.infer<typeof signUpSchema>;

export { signUpSchema };
