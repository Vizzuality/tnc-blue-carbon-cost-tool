import { ComponentProps } from "react";

import { useGlobalFilters } from "@/app/(overview)/url-store";

import Search from "@/components/ui/search";

export default function SearchProjectsTable() {
  const [{ keyword }, setFilters] = useGlobalFilters();

  const handleSearch = async (
    v: Parameters<ComponentProps<typeof Search>["onChange"]>[0],
  ) => {
    await setFilters((prev) => ({ ...prev, keyword: v }));
  };

  return (
    <Search
      placeholder="Search project"
      onChange={handleSearch}
      className="flex-1"
      defaultValue={keyword}
    />
  );
}
