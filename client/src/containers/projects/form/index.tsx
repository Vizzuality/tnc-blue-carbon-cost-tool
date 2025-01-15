"use client";

import { useEffect, useRef } from "react";

import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CustomProjectSchema } from "@shared/schemas/custom-projects/custom-project.schema";
import { ExtractAtomValue, useSetAtom } from "jotai";

import Header from "@/containers/projects/form/header";
import ProjectForm from "@/containers/projects/form/project-form";
import { type CustomProjectForm } from "@/containers/projects/form/setup";
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

  const formValues = useDefaultFormValues(id);
  const methods = useForm<CustomProjectForm>({
    resolver: zodResolver(CustomProjectSchema),
    defaultValues: formValues,
    mode: "all",
  });
  const activity = methods.watch("activity");

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id as ExtractAtomValue<
              typeof formStepAtom
            >;

            setIntersecting(sectionSlug);
          }
        });
      },
      {
        root: ref.current,
        threshold: 0.4,
      },
    );

    const sections = Array.from(
      ref.current.querySelector("#custom-project-steps-container")?.children ||
        [],
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setIntersecting, activity]);

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
