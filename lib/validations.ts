import * as z from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(32, "Group name must be less than 32 characters"),
  type: z.enum(["External", "Internal"]),
});

export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
