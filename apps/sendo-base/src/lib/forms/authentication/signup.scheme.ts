import { z } from "zod";

const signupScheme = z.object({
  email: z
    .string({ required_error: "* Campo obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z.string({ required_error: "* Campo obrigatório" }),
});

type SignUpForms = z.infer<typeof signupScheme>;

export { signupScheme, type SignUpForms };
