import { Input } from "@/components/ui/input";

export default function ProjectsFilters() {
  return (
    <div className="flex w-[450px] flex-col gap-4">
      <Input className="w-full" />
      <Input variant="ghost" className="w-full" />
    </div>
  );
}
