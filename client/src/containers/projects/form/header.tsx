import { useFormContext } from "react-hook-form";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  name: string;
  onSubmit: () => void;
}

export default function Header({ name, onSubmit }: HeaderProps) {
  const methods = useFormContext<CreateCustomProjectForm>();
  const isEdit = name.length > 0;

  return (
    <div className="flex h-16 items-center justify-between py-3 pr-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">
          {isEdit ? `Edit ${name}` : "Custom project"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button disabled={!methods.formState.isValid} onClick={onSubmit}>
          {isEdit ? "Save" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
