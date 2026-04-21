import { z } from "zod";

export const foundItemSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(255),
  dateFound: z.coerce.date(),
  contactInfo: z.string().trim().min(3).max(255),
  imageUrl: z.string().trim().url().optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
});

export const updateFoundItemSchema = foundItemSchema.partial();

export const resolveFoundItemSchema = z.object({
  action: z.literal("resolve"),
});

export const foundItemsQuerySchema = z.object({
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

export type CreateFoundItemInput = z.infer<typeof foundItemSchema>;
export type UpdateFoundItemInput = z.infer<typeof updateFoundItemSchema>;
export type FoundItemQueryInput = z.infer<typeof foundItemsQuerySchema>;
