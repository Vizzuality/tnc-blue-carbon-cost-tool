"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { useAtomValue } from "jotai/index";
import { InfoIcon } from "lucide-react";

import { PRIVACY_POLICY_URL } from "@/lib/constants";

import { useFormValues } from "@/containers/projects/form/project-form";
import { formStepAtom } from "@/containers/projects/store";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const PROJECT_SETUP_STEPS = [
  {
    name: "Project setup",
    slug: "setup",
    optional: false,
  },
  {
    name: "Assumptions",
    slug: "assumptions",
    optional: true,
  },
  {
    name: "Cost inputs overrides",
    slug: "cost-inputs-overrides",
    optional: true,
  },
] as const;

export const RESTORATION_STEPS = [
  {
    name: "Restoration plan",
    slug: "restoration-plan",
    optional: true,
  },
] as const;

export default function ProjectSidebar() {
  const intersecting = useAtomValue(formStepAtom);

  const { activity } = useFormValues();

  const formSteps = useMemo(
    () => [
      ...PROJECT_SETUP_STEPS,
      ...(activity === ACTIVITY.RESTORATION ? RESTORATION_STEPS : []),
    ],
    [activity],
  );

  return (
    <aside className="flex h-full max-w-[320px] flex-col justify-between pb-6">
      <ul className="flex flex-col gap-2">
        {formSteps.map((step) => (
          <li key={step.name}>
            <Button
              variant={step.slug === intersecting ? "default" : "ghost"}
              asChild
              className="w-full justify-start font-medium"
            >
              <Link
                href={`#${step.slug}`}
                aria-controls={step.slug}
                aria-current={intersecting === step.slug ? "true" : undefined}
              >
                {step.name} {step.optional && <span>(optional)</span>}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      <Card className="flex flex-col gap-6 bg-transparent">
        <InfoIcon className="h-5 w-5 text-primary" />
        <p>
          Creating a new project gives you access to a comprehensive analysis
          tailored to your data. The more information you provide, the more
          precise and insightful the analysis will be.
        </p>
        <p>
          All data you enter is{" "}
          <span className="font-semibold">
            private and accessible only to you
          </span>
          . For more details on our commitment to data privacy, please review
          our{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-base underline underline-offset-auto"
            asChild
          >
            <Link href={PRIVACY_POLICY_URL} target="_blank">
              privacy policy
            </Link>
          </Button>
          .
        </p>
      </Card>
    </aside>
  );
}
