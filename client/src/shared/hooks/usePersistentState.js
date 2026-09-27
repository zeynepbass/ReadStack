import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePersistentState(key, initialValue) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["ui", key],
    queryFn: () => initialValue,
    initialData: initialValue,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setValue = useCallback((value) => queryClient.setQueryData(["ui", key], value), [queryClient, key]);

  return [data, setValue];
}
