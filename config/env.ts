export const supabase = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};
export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const jwtSecret = {
  secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  expire: process.env.JWT_EXPIRE || "7d",
};

export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  apiKey: process.env.CLOUDINARY_API_KEY!,
  apiSecret: process.env.CLOUDINARY_API_SECRET!,
};
