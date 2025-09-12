import { z } from "zod";

const adicionalDataSchema = z.object({
  bio: z.string().optional(),
});

export type AdicionalDataScheme = z.infer<typeof adicionalDataSchema>;

export { adicionalDataSchema };
