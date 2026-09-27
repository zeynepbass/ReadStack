import { useQuery } from "@tanstack/react-query";
import { authRepository } from "../repositories/auth.repository";
import { authKeys } from "./authKeys";

export function useMonthlyStats() {
  return useQuery({
    queryKey: authKeys.monthlyStats,
    queryFn: () => authRepository.getMonthlyStats(),
  });
}
