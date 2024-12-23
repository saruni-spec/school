import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MenuLink } from "../types/types";
import SideMenu from "./side_menu";
import SchoolSelection from "./school_selection";
import { useLoadingState } from "@/app/context/user_context";
import InspirationLoader from "@/app/components/loading";
import {
  User,
  ClipboardList,
  NotebookTabs,
  CheckSquare,
  NotepadTextIcon,
} from "lucide-react";

export const Admin_Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadingState();
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
      label: "Review",
      action: () => {
        router.push("/admin/review");
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

export const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadingState();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get the base path (e.g., /teacher)
  const basePath = pathname.split("/")[1];

  // Create a function to preserve and encode query parameters
  const createUrl = (path: string) => {
    const params = new URLSearchParams();

    // Preserve all existing query parameters
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    return `${path}?${params.toString()}`;
  };

  const links: MenuLink[] = [
    {
      label: "Dashboard",
      action: () => {
        router.push(createUrl(`/${basePath}`));
      },
    },
    {
      label: "Schedule",
      icon: <ClipboardList />,
      action: () => {
        router.push(createUrl(`/${basePath}/schedule`));
      },
    },
    {
      label: "Assignments",
      icon: <NotebookTabs />,
      action: () => {
        router.push(createUrl(`/${basePath}/assignments`));
      },
    },
    {
      label: "Take Attendance",
      icon: <CheckSquare />,
      action: () => {
        router.push(createUrl(`/${basePath}/take_attendance`));
      },
    },
    {
      label: "Summary",
      icon: <NotepadTextIcon />,
      action: () => {
        router.push(createUrl(`/${basePath}/summary`));
      },
    },
    {
      label: decodeURIComponent(searchParams.get("name") || ""),
      icon: <User />,
      action: () => {
        router.push(createUrl(`/${basePath}/profile`));
      },
    },
  ];

  return (
    <div className="flex">
      <SideMenu links={links} />
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
