"use client";

import { FormProvider } from "react-hook-form";

import { useAtom } from "jotai";

import { projectFormState, setupFormRef } from "@/app/projects/store";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const [formStore] = useAtom(projectFormState);
  const [setupRef] = useAtom(setupFormRef);

  console.log({ setupRef });

  console.log(formStore.setup?.formState.errors);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">Custom project</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button
          // disabled={!formStore.setup?.formState.isValid}
          type="submit"
          onClick={() => {
            setupRef?.dispatchEvent(new Event("submit", { cancelable: true }));
            // formStore.setup.console.log("clcik");
            // setupRef.
            // console.log(formStore.setup.getValues());
            // formStore.setup?.handleSubmit((data) => {
            //   console.log(data);
            // });
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
