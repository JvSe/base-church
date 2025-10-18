import { z } from "zod";

const personalSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  cpf: z.string().min(1, { message: "CPF é obrigatório" }),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  birthDate: z.date({ message: "Data de nascimento é obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
});

export type PersonalDataScheme = z.infer<typeof personalSchema>;

export { personalSchema };
