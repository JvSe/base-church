import { z } from "zod";

const addressSchema = z
  .object({
    cep: z
      .string()
      .min(1, { message: "CEP é obrigatório" })
      .regex(/^\d{5}-?\d{3}$/, { message: "CEP deve ter o formato 00000-000" }),
    street: z.string().min(1, { message: "Rua é obrigatório" }),
    number: z.string().optional(),
    noNumber: z.boolean().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
    city: z.string().min(1, { message: "Cidade é obrigatório" }),
    state: z
      .string()
      .min(2, { message: "UF é obrigatório" })
      .max(2, { message: "UF deve ter 2 caracteres" })
      .regex(/^[A-Z]{2}$/, { message: "UF deve ser em maiúsculas" }),
  })
  .refine(
    (data) => {
      // Se noNumber não estiver marcado, então number é obrigatório
      if (!data.noNumber && (!data.number || data.number.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Número é obrigatório",
      path: ["number"], // Mostra o erro no campo number
    },
  );

export type AddressScheme = z.infer<typeof addressSchema>;

export { addressSchema };
