export const supabase = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};
export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const jwtSecret = {
  secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m", // 15 minutes
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d", // 7 days
};

export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  apiKey: process.env.CLOUDINARY_API_KEY!,
  apiSecret: process.env.CLOUDINARY_API_SECRET!,
};

export const mongodb = process.env.MONGODB_URI!;
