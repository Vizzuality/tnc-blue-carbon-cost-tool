"use client";

import { useCallback, useEffect, useRef } from "react";

import { FormProvider, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCustomProjectSchema } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { ExtractAtomValue, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";

import Header from "@/containers/projects/form/header";
import ProjectForm from "@/containers/projects/form/project-form";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";
import ProjectSidebar from "@/containers/projects/form/sidebar";
import {
  onSubmit,
  useDefaultFormValues,
} from "@/containers/projects/form/utils";
import { formStepAtom } from "@/containers/projects/store";

import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomProjectFormProps {
  id?: string;
}

export default function CustomProjectForm({ id }: CustomProjectFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(formStepAtom);
  const router = useRouter();
  const { data: session } = useSession();
  const formValues = useDefaultFormValues(id);
  const methods = useForm<CreateCustomProjectForm>({
    resolver: zodResolver(CreateCustomProjectSchema),
    defaultValues: formValues,
    mode: "all",
  });
  const activity = methods.watch("activity");
  const handleOnSubmit = useCallback(() => {
    methods.handleSubmit((data) => onSubmit({ id, data, router, session }))();
  }, [methods, id, router, session]);

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
        <Header name={formValues.projectName} onSubmit={handleOnSubmit} />
        <div className="flex flex-1 gap-3 overflow-hidden" ref={ref}>
          <ProjectSidebar />
          <div className="mb-4 flex-1">
            <ScrollArea className="flex h-full gap-3 pr-6">
              <ProjectForm onSubmit={handleOnSubmit} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
