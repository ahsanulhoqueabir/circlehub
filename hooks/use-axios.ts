import { useAuth } from "@/contexts/auth-context";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

export default function useAxios(): AxiosInstance {
  const { token } = useAuth();
  return useMemo(() => {
    const instance = axios.create();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return instance;
  }, [token]);
}
