import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "@/app/globals.css";
import { getServerSession } from "next-auth";

import { config } from "@/app/auth/api/[...nextauth]/config";

import LayoutProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blue Carbon Cost",
  description: "[TBD]",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(config);

  return (
    <LayoutProviders session={session}>
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
        </body>
      </html>
    </LayoutProviders>
  );
}
