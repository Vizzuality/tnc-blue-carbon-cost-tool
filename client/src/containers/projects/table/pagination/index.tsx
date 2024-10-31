import { Dispatch, SetStateAction } from "react";

import { PaginationMeta } from "@shared/dtos/global/api-response.dto";
import { PaginationState } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PAGINATION_SIZE_OPTIONS = ["25", "50", "75", "100"];

export default function TablePagination({
  onChangePagination,
  pagination,
  className,
}: {
  onChangePagination: Dispatch<SetStateAction<PaginationState>>;
  pagination: PaginationState &
    Pick<PaginationMeta, "totalPages" | "totalItems">;
  className?: HTMLDivElement["className"];
}) {
  return (
    <div className={cn("sticky bottom-0 border-t px-4 py-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="inline-flex">
            {pagination.pageIndex * pagination.pageSize + 1} -{" "}
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              pagination.totalItems,
            )}{" "}
            of {pagination.totalItems}
          </div>
          <Select
            name="paginationSize"
            defaultValue={PAGINATION_SIZE_OPTIONS[0]}
            onValueChange={(v) => {
              onChangePagination((prev) => ({
                ...prev,
                pageSize: Number.parseInt(v),
                pageIndex: 0,
              }));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                onClick={() => {
                  onChangePagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                disabled={pagination.pageIndex === 0}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  onChangePagination((prev) => ({
                    ...prev,
                    pageIndex: pagination.pageIndex - 1,
                  }));
                }}
                disabled={pagination.pageIndex < 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  onChangePagination((prev) => ({
                    ...prev,
                    pageIndex: pagination.pageIndex + 1,
                  }));
                }}
                disabled={pagination.pageIndex + 1 >= pagination.totalPages}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                onClick={() => {
                  onChangePagination((prev) => ({
                    ...prev,
                    pageIndex: pagination.totalPages - 1,
                  }));
                }}
                disabled={
                  pagination.pageIndex === pagination.totalPages - 1 ||
                  pagination.totalPages === 0
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
