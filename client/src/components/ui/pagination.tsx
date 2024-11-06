import * as React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ChevronFirstIcon, ChevronLastIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationButtonProps = {
  isActive?: boolean;
} & ButtonProps;

const PaginationButton = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) => (
  <button
    type="button"
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationButton.displayName = "PaginationButton";

const PaginationFirst = ({ className, ...props }: ButtonProps) => (
  <PaginationButton
    aria-label="Go to first page"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronFirstIcon className="h-4 w-4" />
  </PaginationButton>
);
PaginationFirst.displayName = "PaginationFirst";

const PaginationPrevious = ({ className, ...props }: ButtonProps) => (
  <PaginationButton
    aria-label="Go to previous page"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
  </PaginationButton>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to next page"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationButton>
);
PaginationNext.displayName = "PaginationNext";

const PaginationLast = ({ className, ...props }: ButtonProps) => (
  <PaginationButton
    aria-label="Go to first page"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLastIcon className="h-4 w-4" />
  </PaginationButton>
);
PaginationLast.displayName = "PaginationLast";

export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
};
