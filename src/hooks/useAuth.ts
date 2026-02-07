import { useQuery } from "@tanstack/react-query";
import { getMe } from "../lib/auth-api";

export function useAuth() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
}
