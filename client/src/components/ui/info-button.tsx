import { PropsWithChildren } from "react";
import * as React from "react";

import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InfoButton({
  title,
  children,
  className,
}: PropsWithChildren<{
  title?: string;
  className?: string;
}>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-transparent">
          <InfoIcon className="h-7 w-7 text-foreground hover:text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContentContainer>{children}</DialogContentContainer>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
