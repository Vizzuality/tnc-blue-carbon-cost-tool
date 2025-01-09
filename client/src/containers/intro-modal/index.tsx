"use client";
import { useCallback, useState } from "react";

import {
  introItems,
  setHideIntroModal,
  showIntroModal,
} from "@/containers/intro-modal/utils";

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

const IntroModal = () => {
  const [isOpen, setIsOpen] = useState(showIntroModal());
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const handleClose = useCallback(
    (open = false) => {
      setIsOpen(open);

      if (dontShowAgain) {
        setHideIntroModal();
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
