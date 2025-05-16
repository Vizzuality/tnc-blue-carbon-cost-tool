"use client";

import { useRef } from "react";

import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { CustomProjectFormSchema } from "@shared/schemas/custom-projects/custom-project-form.schema";
import { useSetAtom } from "jotai";
import { parseAsBoolean, useQueryState } from "nuqs";

import { useScrollSpy } from "@/hooks/use-scroll-spy";

import Header from "@/containers/projects/form/header";
import ProjectForm from "@/containers/projects/form/project-form";
import ProjectSidebar from "@/containers/projects/form/sidebar";
import { useDefaultFormValues } from "@/containers/projects/form/utils";
import { formStepAtom } from "@/containers/projects/store";

import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomProjectFormProps {
  id?: string;
}

export default function CustomProjectForm({ id }: CustomProjectFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(formStepAtom);
  const [useCache] = useQueryState(
    "useCache",
    parseAsBoolean.withDefault(false),
  );
  const formValues = useDefaultFormValues(useCache, id);
  const methods = useForm<CustomProjectForm>({
    resolver: zodResolver(CustomProjectFormSchema),
    defaultValues: formValues,
    values: formValues,
    mode: "all",
  });
  const activity = methods.watch("activity");
  useScrollSpy({
    id: "custom-project-steps-container",
    containerRef: ref,
    setCurrentStep: setIntersecting,
    options: {
      threshold: 0.4,
    },
    deps: [activity],
  });

  console.log("???", formValues);

  return (
    <FormProvider {...methods}>
      <div className="ml-4 flex flex-1 flex-col">
        <Header name={formValues.projectName} id={id} />
        <div className="flex flex-1 gap-3 overflow-hidden" ref={ref}>
          <ProjectSidebar />
          <div className="mb-4 flex-1">
            <ScrollArea className="flex h-full gap-3 pr-6">
              <ProjectForm />
            </ScrollArea>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
