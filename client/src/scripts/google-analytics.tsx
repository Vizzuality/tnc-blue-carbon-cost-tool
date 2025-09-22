"use client";

import { useEffect, useState } from "react";

import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { useAtom } from "jotai";

import { analyticsConsentAtom } from "@/app/(overview)/store";

const GA_ID = "G-N6HX0XYEGG";

export default function GoogleAnalytics() {
  const [mounted, setMounted] = useState(false);
  const [consent] = useAtom(analyticsConsentAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || consent === false) {
    return null;
  }

  return <GA gaId={GA_ID} />;
}
