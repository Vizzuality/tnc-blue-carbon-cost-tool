import { PropsWithChildren } from "react";

import { Spline_Sans } from "next/font/google";

import type { Metadata } from "next";
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { config } from "@/app/auth/api/[...nextauth]/config";

import MainNav from "@/containers/nav";

import { SidebarProvider } from "@/components/ui/sidebar";
import Toaster from "@/components/ui/toast/toaster";

import LayoutProviders from "./providers";

const inter = Spline_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spline-sans",
});

export const metadata: Metadata = {
  title: "Blue Carbon Cost Tool",
  description:
    "The Blue Carbon Cost Tool estimates project costs and carbon benefits of Blue Carbon Market projects, providing a high-level view for comparisons and prioritization among difference project scenarios.",
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
            <SidebarProvider>
              <MainNav />
              <main className="mx-3 flex h-dvh flex-1">{children}</main>
            </SidebarProvider>
            <Toaster />
          </body>
        </NuqsAdapter>
      </html>
    </LayoutProviders>
  );
}
