import * as z from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(32, "Group name must be less than 32 characters"),
  type: z.enum(["External", "Internal"]),
});

export type CreateGroupSchema = z.infer<typeof createGroupSchema>;

export const createTransactionSchema = z.object({
  title: z
    .string()
    .min(1, "Transaction title is required")
    .max(100, "Transaction title must be less than 100 characters"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount must be less than 1,000,000"),
  type: z.enum(["income", "expense"]),
  date: z.date(),
  group: z.number().int().positive().optional(),
  category: z.string().nullable().optional(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  title: z
    .string()
    .min(1, "Transaction title is required")
    .max(100, "Transaction title must be less than 100 characters"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount must be less than 1,000,000"),
  type: z.enum(["income", "expense"]),
  date: z.date(),
  category: z.string().nullable().optional(),
});

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;

export const updateDisplayNameSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(32, "Display name must be less than 32 characters"),
});

export type UpdateDisplayNameSchema = z.infer<typeof updateDisplayNameSchema>;
