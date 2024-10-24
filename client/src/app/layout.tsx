import { PropsWithChildren } from "react";

import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { config } from "@/app/auth/api/[...nextauth]/config";

import Toaster from "@/components/ui/toast/toaster";

import LayoutProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blue Carbon Cost",
  description: "[TBD]",
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const session = await getServerSession(config);

  return (
    <LayoutProviders session={session}>
      <html lang="en">
        <NuqsAdapter>
          <body className={inter.className}>
            <main>{children}</main>
            <Toaster />
          </body>
        </NuqsAdapter>
      </html>
    </LayoutProviders>
  );
}
