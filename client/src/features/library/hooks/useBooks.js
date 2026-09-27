import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { bookKeys } from "@/shared/queries/books";
import { libraryRepository } from "../repositories/library.repository";

export function useBooks() {
  return useQuery({
    queryKey: bookKeys.list,
    queryFn: () => libraryRepository.getAll(),
  });
}

export function useBookSearch({ search, prio }) {
  const active = Boolean(search) || prio !== "all";
  const query = useQuery({
    queryKey: bookKeys.search({ search, prio }),
    queryFn: () => libraryRepository.search({ search, prio }),
    enabled: active,
    placeholderData: keepPreviousData,
  });

  const ids = useMemo(
    () => (active && query.data ? new Set(query.data.map((doc) => doc._id)) : null),
    [active, query.data]
  );

  return { ids, error: query.error };
}
