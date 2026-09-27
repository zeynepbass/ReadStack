import { useMutation, useQueryClient } from "@tanstack/react-query";
import { session } from "@/shared/apiClient";
import { authRepository } from "../repositories/auth.repository";
import { authKeys } from "./authKeys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authRepository.login({ email, password }),
    onSuccess: (data, { remember = true }) => {
      session.save(data, remember);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ revoke = false } = {}) => {
      const refreshToken = session.get("refreshToken");
      session.clear();
      queryClient.removeQueries();
      if (revoke && refreshToken) await authRepository.logout(refreshToken).catch(() => {});
    },
  });
}
