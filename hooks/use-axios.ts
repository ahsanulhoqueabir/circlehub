import { useAuth } from "@/contexts/auth-context";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

/**
 * Custom hook to create an axios instance with authentication
 * Automatically attaches the access token to all requests
 */
export default function useAxios(): AxiosInstance {
  const { accessToken } = useAuth();

  return useMemo(() => {
    const instance = axios.create();

    if (accessToken) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }

    return instance;
  }, [accessToken]);
}
