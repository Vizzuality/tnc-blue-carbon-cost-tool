"use client";

import Link from "next/link";

import useLatestChangelog from "@/hooks/use-latest-changelog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VersionBanner() {
  const { data } = useLatestChangelog();

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="space-x-3 text-sm">
        <span className="inline-block space-x-1">
          <span>Current version used:</span>{" "}
          <Badge variant="outline">{data?.versionName ?? "N/A"}</Badge>
        </span>
        <span>
          Check the{" "}
          <Button asChild variant="link" className="h-auto p-0 text-primary">
            <Link href="/methodology">Methodology section</Link>
          </Button>{" "}
          to review the most accurate values.
        </span>
      </div>
    </div>
  );
}
