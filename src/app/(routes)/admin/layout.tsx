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
      <Admin_Layout>
        {" "}
        <div className="ml-64 flex-grow">{children} </div>
      </Admin_Layout>
    </SessionProvider>
  );
}
