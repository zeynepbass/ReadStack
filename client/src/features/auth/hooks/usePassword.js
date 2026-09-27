import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../repositories/auth.repository";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authRepository.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (form) => authRepository.resetPassword(form),
  });
}
