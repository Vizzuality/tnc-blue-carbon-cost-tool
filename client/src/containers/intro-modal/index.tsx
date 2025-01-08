"use client";
import { useCallback, useState } from "react";

import {
  ClipboardPenIcon,
  FileQuestionIcon,
  LayoutDashboardIcon,
  UserIcon,
} from "lucide-react";

import { introModalManager } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { CheckboxWrapper } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const introItems = [
  {
    title: "Project Overview",
    description:
      "Explore and compare over 400 project scenarios with ease. Apply filters for location, ecosystem type, activity, cost, abatement potential and project size. The global map visualizes project blue carbon potential across 9 countries, enabling comparisons based on cost-to-abatement ratios. Additionally, use the comparison table for detailed cost and score analyses, and select a project for additional details.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Create custom projects",
    description:
      "Design custom scenarios by modifying default parameters and exploring the resulting data in detail. Save your projects to revisit them anytime and quickly compare all the scenarios you’ve created.",
    icon: ClipboardPenIcon,
  },
  {
    title: "Methodology",
    description:
      "Explore for detailed information on model assumptions, estimations, and data sources.",
    icon: FileQuestionIcon,
  },
  {
    title: "Profile",
    description: "Access information about your personal account.",
    icon: UserIcon,
  },
];

const IntroModal = () => {
  const [isOpen, setIsOpen] = useState(introModalManager.showIntroModal());
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const handleClose = useCallback(
    (open = false) => {
      setIsOpen(open);

      if (dontShowAgain) {
        introModalManager.setHideIntroModal();
      }
    },
    [dontShowAgain],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-xl font-semibold">
            Welcome to the Blue Carbon Cost Tool
          </DialogTitle>
          <DialogDescription className="text-base font-normal text-foreground">
            The Blue Carbon Cost Tool estimates project costs and carbon
            benefits of Blue Carbon Market projects, providing a high-level view
            for comparisons and prioritization among different project
            scenarios.
          </DialogDescription>
        </DialogHeader>
        <ul className="mb-6 space-y-4">
          {introItems.map((item) => (
            <li key={item.title}>
              <div className="flex items-start gap-4 pt-2">
                <div className="rounded-full bg-sidebar-accent p-2">
                  <item.icon
                    className="size-5 text-big-stone-50"
                    strokeWidth={1}
                  />
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="text-sm font-normal text-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <DialogFooter className="flex-col gap-4 sm:items-center sm:justify-between">
          <CheckboxWrapper
            id="dontShowAgain"
            label="Don't show this introduction again."
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked === true)}
          />
          <Button onClick={() => handleClose()}>Discover</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroModal;
