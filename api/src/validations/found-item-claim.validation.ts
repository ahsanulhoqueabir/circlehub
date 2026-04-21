import { z } from "zod";

export const createClaimSchema = z.object({
  foundItemId: z.string().trim().min(1),
  message: z.string().trim().max(1000).optional(),
  contactInfo: z
    .object({
      phone: z.string().trim().optional(),
      email: z.string().email().optional(),
      other: z.string().trim().optional(),
    })
    .optional(),
});

export const updateClaimStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const claimsQuerySchema = z.object({
  foundItemId: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimStatusInput = z.infer<typeof updateClaimStatusSchema>;
export type ClaimQueryInput = z.infer<typeof claimsQuerySchema>;
