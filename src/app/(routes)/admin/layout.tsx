"use client";
import { Admin_Layout } from "@/app/components/lay_outs";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Admin_Layout>{children}</Admin_Layout>
    </SessionProvider>
  );
}
