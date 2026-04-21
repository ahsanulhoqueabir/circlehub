import { z } from "zod";

export const lostItemSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(255),
  dateLost: z.coerce.date(),
  contactInfo: z.string().trim().min(3).max(255),
  imageUrl: z.string().trim().url().optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  rewardAmount: z.number().min(0).optional(),
});

export const updateLostItemSchema = lostItemSchema.partial();

export const resolveLostItemSchema = z.object({
  action: z.literal("resolve"),
});

export const lostItemsQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["active", "resolved", "archived"]).optional(),
  search: z.string().optional(),
  tags: z.string().optional(),
  location: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  userId: z.string().optional(),
  sort: z
    .enum(["newest", "oldest", "most-viewed", "recently-updated"])
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  action: z.enum(["statistics"]).optional(),
});

export type CreateLostItemInput = z.infer<typeof lostItemSchema>;
export type UpdateLostItemInput = z.infer<typeof updateLostItemSchema>;
export type LostItemQueryInput = z.infer<typeof lostItemsQuerySchema>;
