import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../repositories/auth.repository";

export function useRegister() {
  return useMutation({
    mutationFn: (form) => authRepository.register(form),
  });
}
