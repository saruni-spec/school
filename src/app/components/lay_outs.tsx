import React from "react";
import { useRouter } from "next/navigation";
import { MenuLink } from "../types/types";
import SideMenu from "./side_menu";
import SchoolSelection from "./school_selection";
import { useLoadingState } from "@/app/context/user_context";
import InspirationLoader from "@/app/components/loading";

export const Admin_Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, setLoading } = useLoadingState();
  const router = useRouter();
  const links: MenuLink[] = [
    {
      label: "Dashboard",
      action: () => {
        router.push("/admin");
      },
    },
    {
      label: "Register",
      action: () => {
        router.push("/admin/register");
      },
    },
    {
      label: "View",
      action: () => {
        router.push("/admin/view");
      },
    },
    {
      label: "Update",
      action: () => {
        router.push("/admin/update");
      },
    },
    {
      label: "Delete",
      action: () => {
        router.push("/admin/delete");
      },
    },
  ];

  return (
    <div className="flex">
      <SideMenu links={links} SchoolSelect={SchoolSelection} />
      {isLoading && <InspirationLoader isLoading={isLoading} />}
      {!isLoading && <>{children}</>}
    </div>
  );
};

export const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex">{children}</div>;
};

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex">{children}</div>;
};

export const PrinciPalLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex">{children}</div>;
};
