import { z } from "zod";

export const adminUpdateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().optional(),
  isVerified: z.boolean().optional(),
});

export const adminChangeUserRoleSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(["user", "admin", "moderator", "support_staff"]),
});

export const adminQuerySchema = z.object({
  role: z.enum(["user", "admin", "moderator", "support_staff"]).optional(),
  isVerified: z.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["newest", "oldest", "name"]).optional(),
});

export const adminItemsQuerySchema = z.object({
  itemType: z.enum(["lost", "found", "share"]),
  status: z.string().optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const adminClaimsQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["newest", "oldest"]).optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type AdminChangeUserRoleInput = z.infer<
  typeof adminChangeUserRoleSchema
>;
export type AdminQueryInput = z.infer<typeof adminQuerySchema>;
export type AdminItemsQueryInput = z.infer<typeof adminItemsQuerySchema>;
export type AdminClaimsQueryInput = z.infer<typeof adminClaimsQuerySchema>;
