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

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const updateUserNameSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
});

export type UpdateUserNameSchema = z.infer<typeof updateUserNameSchema>;

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>;

export const updateAccountNotificationsSchema = z.object({
  reminderEmails: z.boolean(),
  activityEmails: z.boolean(),
  newsletterEmails: z.boolean(),
  securityEmails: z.boolean(),
});

export type UpdateAccountNotificationsSchema = z.infer<
  typeof updateAccountNotificationsSchema
>;
