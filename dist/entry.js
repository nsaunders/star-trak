import { z } from "zod";
export const schema = z.object({
    date: z.coerce.date(),
    added: z.array(z.string()),
    removed: z.array(z.string()),
});
