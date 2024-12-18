import { useEffect } from "react";

import { PaginationState } from "@tanstack/react-table";

export function useTablePaginationReset(
  keyword: string | undefined,
  setPagination: (updater: (prev: PaginationState) => PaginationState) => void,
) {
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [keyword, setPagination]);
}
