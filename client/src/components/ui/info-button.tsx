import * as React from "react";
import { PropsWithChildren, useState } from "react";

import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InfoButton({
  title,
  children,
  className,
}: PropsWithChildren<{
  title?: string;
  className?: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          onClick={() => {
            setOpen(true);
          }}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            {
              "z-50 h-5 w-5 p-0 hover:bg-transparent": true,
            },
          )}
        >
          <InfoIcon className="h-7 w-7 text-foreground hover:text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className={cn(className, "max-h-[80%] overflow-auto")}>
        <DialogHeader className="space-y-4">
          {title && <DialogTitle>{title}</DialogTitle>}
          <ScrollArea className="h-full">
            <DialogContentContainer>{children}</DialogContentContainer>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
