"use client";

import { useFormContext } from "react-hook-form";

import { useRouter } from "next/navigation";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { onSubmit } from "./index";

export default function Header() {
  const methods = useFormContext<CreateCustomProjectForm>();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between py-3 pr-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">Custom project</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button
          // disabled={!methods.formState.isValid}
          onClick={() => {
            methods.handleSubmit((data) => onSubmit(data))();
            router.push("/projects/preview");
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
