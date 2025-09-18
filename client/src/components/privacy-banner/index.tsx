"use client";

import { useEffect, useState } from "react";

import { useAtom } from "jotai";

import { analyticsConsentAtom } from "@/app/(overview)/store";

import { Button } from "@/components/ui/button";

export default function PrivacyBanner() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useAtom(analyticsConsentAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (consent !== undefined || !mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-12 items-center justify-between border-t bg-background px-12 py-6 xl:px-[100px]">
      <p className="col-span-8 text-sm xl:col-span-6">
        We use cookies to enhance site navigation, analyze site usage, customize
        your experience, and assist in our marketing efforts. By clicking
        &quot;Accept All Cookies&quot; you agree to the storing of performance,
        functional, and targeting cookies on your device. If you do not agree to
        the storing of any cookies that are not strictly necessary for the
        functioning of the site on your device, click on &quot;Deny all non
        essential cookies&quot;. For more information, review our Privacy
        Statement.{" "}
        <a
          href="https://www.nature.org/en-us/about-us/who-we-are/accountability/privacy-policy/"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline"
        >
          View our Privacy Statement.
        </a>
      </p>
      <div className="col-span-4 flex flex-col-reverse items-center justify-end gap-6 xl:col-span-6 xl:flex-row">
        <Button onClick={() => setConsent(false)} variant="outline">
          Deny all non essential cookies
        </Button>
        <Button onClick={() => setConsent(true)}>Accept all cookies</Button>
      </div>
    </div>
  );
}
