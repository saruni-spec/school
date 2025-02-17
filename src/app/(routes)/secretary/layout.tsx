"use client";
import { SecretaryLayout } from "@/app/components/lay_outs";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SecretaryLayout>
        <div className="ml-64 flex-grow min-h-screen">{children} </div>
      </SecretaryLayout>
    </SessionProvider>
  );
}
