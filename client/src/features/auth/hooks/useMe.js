import { useQuery } from "@tanstack/react-query";
import { session } from "@/shared/apiClient";
import { authRepository } from "../repositories/auth.repository";
import { authKeys } from "./authKeys";

export function useMe({ enabled = true } = {}) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const user = await authRepository.me();
      session.setUser(user);
      return user;
    },
    enabled,
    initialData: () => session.getUser() ?? undefined,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}
