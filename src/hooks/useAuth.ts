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

  const user = query.data;
  const tenant = user?.tenant;
  const subscription = tenant?.subscription;

  return {
    user,
    tenant,
    subscription,
    isLoading: query.isLoading,
    isAuthenticated: !!user,
  };
}
