"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PROJECT_SETUP_STEPS = [
  {
    name: "Project setup",
    link: "/projects/new?step=setup",
    optional: false,
  },
  {
    name: "Assumptions",
    link: "/projects/new?step=assumptions",
    optional: true,
  },
  {
    name: "Cost inputs overrides",
    link: "/projects/new?step=cost-inputs-overrides",
    optional: true,
  },
];

export default function ProjectSidebar() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step");

  return (
    <aside className="flex h-full max-w-[320px] flex-col justify-between pb-6">
      <ul className="flex flex-col gap-2">
        {PROJECT_SETUP_STEPS.map((step) => (
          <li key={step.name}>
            <Button
              variant={
                step.link?.includes(
                  currentStep as NonNullable<typeof currentStep>,
                ) ||
                (!currentStep && step.name === "Project setup")
                  ? "default"
                  : "ghost"
              }
              asChild
            >
              <Link href={step.link}>
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
          our privacy policy.
        </p>
      </Card>
    </aside>
  );
}
