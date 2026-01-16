import { useAuth } from "@/contexts/auth-context";
import axios, { AxiosInstance } from "axios";
import { useMemo, useEffect } from "react";

/**
 * Custom hook to create an axios instance with authentication
 * Automatically attaches the access token to all requests
 */
export default function useAxios(): AxiosInstance {
  const { accessToken } = useAuth();

  const instance = useMemo(() => {
    const axiosInstance = axios.create();

    // Add request interceptor to always use latest token
    axiosInstance.interceptors.request.use(
      (config) => {
        // Get the latest token from localStorage
        const token = localStorage.getItem("campus_connect_access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }, []); // Empty dependency array - create instance once

  // Update headers when accessToken changes
  useEffect(() => {
    if (accessToken) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  }, [accessToken, instance]);

  return instance;
}
