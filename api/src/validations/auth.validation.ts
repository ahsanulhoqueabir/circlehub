import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(6).max(128),
  studentId: z.string().trim().min(1).max(50),
  department: z.string().trim().min(1).max(120),
  batch: z.string().trim().min(1).max(50),
  phone: z.string().trim().min(6).max(30).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
