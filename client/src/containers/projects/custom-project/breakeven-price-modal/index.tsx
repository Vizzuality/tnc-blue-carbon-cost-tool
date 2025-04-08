"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BreakevenPriceModalProps {
  open: boolean;
  redirectPath: string;
}
const BreakevenPriceModal = ({
  open,
  redirectPath,
}: BreakevenPriceModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-xl font-semibold">
            Proceed without breakeven price
          </DialogTitle>
          <DialogDescription className="text-base font-normal text-foreground">
            We were unable to determine the breakeven price within the current
            parameters. This may occur if the initial carbon price is too far
            from the expected breakeven value. You can adjust the initial carbon
            price and try again, or proceed without the breakeven price.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" asChild>
            <Link href={redirectPath}>Adjust values</Link>
          </Button>
          <Button onClick={() => setIsOpen(false)}>Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BreakevenPriceModal;
