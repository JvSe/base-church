import { z } from "zod";

const signInSchema = z.object({
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
});

export type SignInScheme = z.infer<typeof signInSchema>;

export { signInSchema };
