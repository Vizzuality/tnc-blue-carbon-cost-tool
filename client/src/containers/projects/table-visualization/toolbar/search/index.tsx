import { ComponentProps } from "react";

import { useSetAtom } from "jotai";

import { projectsFiltersState } from "@/app/(projects)/store";

import Search from "@/components/ui/search";

export default function SearchProjectsTable() {
  const setFilters = useSetAtom(projectsFiltersState);
  const handleSearch = (
    v: Parameters<ComponentProps<typeof Search>["onChange"]>[0],
  ) => {
    setFilters((prev) => ({ ...prev, keyword: v }));
  };

  return <Search placeholder="Search project" onChange={handleSearch} />;
}
