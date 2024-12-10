"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";

import mockResponse from "@/app/projects/preview/mock-response";

import CustomProject from "@/containers/projects/custom-project";

export default function CustomProjectPage() {
  /**
   *
   * Mimic queryCache from createCustomProject response
   *
   * This is only for testing purpose with the current mock data,
   * and should be replaced when the complete user flow is done
   */
  const router = useRouter();
  const QUERYKEY = "custom-project-mock-data";
  const [withMockData] = useQueryState(
    "mock",
    parseAsBoolean.withDefault(false),
  );
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<typeof mockResponse>([QUERYKEY]);
  // To trigger re-render:
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done || !withMockData || data) return;

    queryClient.setQueryData([QUERYKEY], mockResponse);
    setDone(true);
  }, [withMockData, data, queryClient, done, setDone]);
  /**
   *
   */

  useEffect(() => {
    // Mimic redirect when no queryCache found
    if (!withMockData) {
      router.push("/new");
    }
  }, [withMockData, router]);

  // TODO: probably show a spinner or skeleton?
  if (!data) return null;

  return <CustomProject data={data.data as any} />;
}
