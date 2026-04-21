import { z } from "zod";

export const shareItemSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(1).max(100),
  condition: z.enum(["new", "like-new", "good", "fair"]),
  offerType: z.enum(["free", "sale"]),
  price: z.number().min(0).optional(),
  location: z.string().trim().min(1).max(255),
  imageUrl: z.string().trim().url().optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
});

export const updateShareItemSchema = shareItemSchema.partial();

export const updateShareItemStatusSchema = z.object({
  status: z.enum(["available", "reserved", "shared"]),
});

export const shareItemsQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["available", "reserved", "shared"]).optional(),
  search: z.string().optional(),
  tags: z.string().optional(),
  location: z.string().optional(),
  userId: z.string().optional(),
  offerType: z.enum(["free", "sale"]).optional(),
  condition: z.enum(["new", "like-new", "good", "fair"]).optional(),
  sort: z
    .enum(["newest", "oldest", "most-viewed", "price-asc", "price-desc"])
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  action: z.enum(["statistics"]).optional(),
});

export type CreateShareItemInput = z.infer<typeof shareItemSchema>;
export type UpdateShareItemInput = z.infer<typeof updateShareItemSchema>;
export type UpdateShareItemStatusInput = z.infer<
  typeof updateShareItemStatusSchema
>;
export type ShareItemQueryInput = z.infer<typeof shareItemsQuerySchema>;
