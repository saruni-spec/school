"use client";
import { Admin_Layout } from "@/app/components/lay_outs";
import { useSidebarStore } from "@/app/context/user_context";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCollapsed } = useSidebarStore();
  return (
    <SessionProvider>
      <Admin_Layout>
        <div
          className={`
            transition-all duration-300 ease-in-out
            ml-${isCollapsed ? "60" : "64"} flex-grow
            ${isCollapsed ? "pl-14" : ""}
            pt-16 md:pt-0 min-h-screen
          `}
        >
          {children}
        </div>
      </Admin_Layout>
    </SessionProvider>
  );
}
