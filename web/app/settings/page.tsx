"use client";

import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Settings,
  User,
  Shield,
  Moon,
  Sun,
  LogOut,
  X,
  AlertTriangle,
  Lock,
  Phone,
  Building2,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import useAxios from "@/hooks/use-axios";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const { setTheme, actualTheme } = useTheme();
  const router = useRouter();
  const axios = useAxios();

  // Modal states
  const [is_edit_profile_open, setIsEditProfileOpen] = useState(false);
  const [is_change_password_open, setIsChangePasswordOpen] = useState(false);
  const [is_delete_account_open, setIsDeleteAccountOpen] = useState(false);

  // Form states
  const [profile_data, setProfileData] = useState({
    name: "",
    university: "",
    studentId: "",
    phone: "",
  });

  const [password_data, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [delete_password, setDeletePassword] = useState("");
  const [show_passwords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });

  // Loading and error states
  const [is_updating, setIsUpdating] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [success_message, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        university: user.university || "",
        studentId: user.studentId || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleThemeToggle = () => {
    const new_theme = actualTheme === "light" ? "dark" : "light";
    setTheme(new_theme);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.put("/api/user/profile", profile_data);
      setSuccessMessage("Profile updated successfully!");
      await refreshUser();
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (error: unknown) {
      const api_error = error as { response?: { data?: { error?: string } } };
      setErrorMessage(
        api_error.response?.data?.error || "Failed to update profile",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password_data.new_password !== password_data.confirm_password) {
      setErrorMessage("New passwords do not match");
      setIsUpdating(false);
      return;
    }

    try {
      await axios.put("/api/user/password", password_data);
      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (error: unknown) {
      const api_error = error as { response?: { data?: { error?: string } } };
      setErrorMessage(
        api_error.response?.data?.error || "Failed to change password",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage("");

    try {
      await axios.delete("/api/user/delete", {
        data: { password: delete_password },
      });
      logout();
      router.push("/");
    } catch (error: unknown) {
      const api_error = error as { response?: { data?: { error?: string } } };
      setErrorMessage(
        api_error.response?.data?.error || "Failed to delete account",
      );
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-purple-100 mt-1">
                  Manage your account preferences
                </p>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Account Settings */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Account Settings
              </h2>
              <div className="bg-muted rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Profile Information
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your name, university, and contact details
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="font-medium text-foreground">
                      Change Password
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Privacy & Security
              </h2>
              <div className="bg-muted rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Account Verification
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Status:{" "}
                      <span
                        className={
                          user?.verified
                            ? "text-green-600 font-medium"
                            : "text-orange-600 font-medium"
                        }
                      >
                        {user?.verified ? "Verified" : "Pending Verification"}
                      </span>
                    </p>
                  </div>
                  {!user?.verified && (
                    <button className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                      Verify Account
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Appearance */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                {actualTheme === "light" ? (
                  <Sun className="w-5 h-5 mr-2 text-yellow-600" />
                ) : (
                  <Moon className="w-5 h-5 mr-2 text-indigo-600" />
                )}
                Appearance
              </h2>
              <div className="bg-muted rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current theme:{" "}
                      <span className="font-medium">
                        {actualTheme === "light" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-sm hover:shadow-md"
                  >
                    {actualTheme === "light" ? (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Switch to Dark</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Switch to Light</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-400">
                      Delete Account
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDeleteAccountOpen(true)}
                    className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    Delete Account
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-400">
                        Sign Out
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-sm hover:shadow-md"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {is_edit_profile_open && (
        <Modal onClose={() => setIsEditProfileOpen(false)} title="Edit Profile">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {error_message && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error_message}
              </div>
            )}
            {success_message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm">
                {success_message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name
              </label>
              <input
                type="text"
                value={profile_data.name}
                onChange={(e) =>
                  setProfileData({ ...profile_data, name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                University (Optional)
              </label>
              <input
                type="text"
                value={profile_data.university}
                onChange={(e) =>
                  setProfileData({
                    ...profile_data,
                    university: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Student ID (Optional)
              </label>
              <input
                type="text"
                value={profile_data.studentId}
                onChange={(e) =>
                  setProfileData({ ...profile_data, studentId: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={profile_data.phone}
                onChange={(e) =>
                  setProfileData({ ...profile_data, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={is_updating}
                className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {is_updating ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {is_change_password_open && (
        <Modal
          onClose={() => setIsChangePasswordOpen(false)}
          title="Change Password"
        >
          <form onSubmit={handleChangePassword} className="space-y-4">
            {error_message && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error_message}
              </div>
            )}
            {success_message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm">
                {success_message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show_passwords.current ? "text" : "password"}
                  value={password_data.current_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...password_data,
                      current_password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...show_passwords,
                      current: !show_passwords.current,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show_passwords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={show_passwords.new ? "text" : "password"}
                  value={password_data.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...password_data,
                      new_password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...show_passwords,
                      new: !show_passwords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show_passwords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show_passwords.confirm ? "text" : "password"}
                  value={password_data.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...password_data,
                      confirm_password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...show_passwords,
                      confirm: !show_passwords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show_passwords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={is_updating}
                className="flex-1 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {is_updating ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {is_delete_account_open && (
        <Modal
          onClose={() => setIsDeleteAccountOpen(false)}
          title="Delete Account"
        >
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-400">
                    Warning: This action cannot be undone!
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Deleting your account will permanently remove all your data,
                    including your lost/found items, claims, and account
                    information.
                  </p>
                </div>
              </div>
            </div>

            {error_message && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error_message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Enter your password to confirm
              </label>
              <div className="relative">
                <input
                  type={show_passwords.delete ? "text" : "password"}
                  value={delete_password}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-foreground pr-12"
                  required
                  placeholder="Confirm with your password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...show_passwords,
                      delete: !show_passwords.delete,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show_passwords.delete ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={is_updating}
                className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {is_updating ? "Deleting..." : "Delete My Account"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteAccountOpen(false)}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
