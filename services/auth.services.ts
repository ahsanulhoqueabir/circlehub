import { createServerClient } from "@/lib/supabase";
import { baseUrl } from "@/config/env";
import type {
  RegisterRequest,
  LoginRequest,
  UserProfile,
  AuthSuccessResponse,
  GoogleAuthResponse,
  LogoutResponse,
  ServiceResponse,
} from "@/types/auth.types";

/**
 * Register a new user with email and password
 */
export async function registerUser(
  data: RegisterRequest
): Promise<ServiceResponse<AuthSuccessResponse>> {
  try {
    const { email, password, name, university, studentId } = data;

    // Validation
    if (!email || !password || !name) {
      return {
        success: false,
        error: "Email, password, and name are required",
        statusCode: 400,
      };
    }

    const supabase = createServerClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          university: university,
          student_id: studentId,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        statusCode: 400,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Registration failed",
        statusCode: 400,
      };
    }

    const userProfile: UserProfile = {
      id: authData.user.id,
      email: authData.user.email || email,
      name: name,
      university: university,
      studentId: studentId,
      verified: false,
      role: "student", // Default role
    };

    return {
      success: true,
      data: {
        message: "Registration successful. Please login to continue.",
        user: userProfile,
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error("Register service error:", error);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(
  data: LoginRequest
): Promise<ServiceResponse<AuthSuccessResponse>> {
  try {
    const { email, password } = data;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
        statusCode: 400,
      };
    }

    const supabase = createServerClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        statusCode: 401,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Login failed",
        statusCode: 401,
      };
    }

    // Fetch user profile from database to get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    const userRole = profile?.role || "student";

    const userProfile: UserProfile = {
      id: authData.user.id,
      email: authData.user.email || "",
      name:
        authData.user.user_metadata?.full_name ||
        authData.user.user_metadata?.name ||
        authData.user.email?.split("@")[0] ||
        "User",
      avatar: authData.user.user_metadata?.avatar_url,
      university: authData.user.user_metadata?.university,
      studentId: authData.user.user_metadata?.student_id,
      verified: authData.user.email_confirmed_at ? true : false,
      role: userRole,
    };

    // Import JWT service and generate token
    const { JWTService } = await import("./jwt.services");
    const token = JWTService.generateJWTToken({
      id: authData.user.id,
      email: authData.user.email || "",
      role: userRole,
    });

    return {
      success: true,
      data: {
        message: "Login successful",
        user: userProfile,
        token: token,
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<ServiceResponse<LogoutResponse>> {
  try {
    const supabase = createServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
        statusCode: 400,
      };
    }

    return {
      success: true,
      data: {
        message: "Logout successful",
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error("Logout service error:", error);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}

/**
 * Initiate Google OAuth authentication
 */
export async function initiateGoogleAuth(): Promise<
  ServiceResponse<GoogleAuthResponse>
> {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        statusCode: 400,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: "Failed to generate OAuth URL",
        statusCode: 400,
      };
    }

    return {
      success: true,
      data: {
        url: data.url,
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error("Google auth service error:", error);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}

/**
 * Get current user data by ID from token
 */
export async function getCurrentUser(
  userId: string
): Promise<ServiceResponse<AuthSuccessResponse>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
        statusCode: 400,
      };
    }

    const supabase = createServerClient();

    // Fetch user from auth.users
    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(userId);

    if (authError || !authUser.user) {
      // Try getting from profiles table instead
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        return {
          success: false,
          error: "User not found",
          statusCode: 404,
        };
      }

      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email,
        name: profile.name || "",
        avatar: profile.avatar_url || undefined,
        university: profile.university || undefined,
        studentId: profile.student_id || undefined,
        verified: profile.verified || false,
        role: profile.role || "student",
      };

      return {
        success: true,
        data: {
          message: "User fetched successfully",
          user: userProfile,
        },
        statusCode: 200,
      };
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, verified, university, student_id")
      .eq("id", userId)
      .single();

    const userProfile: UserProfile = {
      id: authUser.user.id,
      email: authUser.user.email || "",
      name:
        authUser.user.user_metadata?.full_name ||
        authUser.user.user_metadata?.name ||
        authUser.user.email?.split("@")[0] ||
        "User",
      avatar: authUser.user.user_metadata?.avatar_url,
      university:
        profile?.university || authUser.user.user_metadata?.university,
      studentId: profile?.student_id || authUser.user.user_metadata?.student_id,
      verified:
        profile?.verified || (authUser.user.email_confirmed_at ? true : false),
      role: profile?.role || "student",
    };

    return {
      success: true,
      data: {
        message: "User fetched successfully",
        user: userProfile,
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error("Get current user service error:", error);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}
