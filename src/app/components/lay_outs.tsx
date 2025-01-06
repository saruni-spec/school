import React, { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MenuLink } from "../types/types";
import SideMenu from "./side_menu";
import SchoolSelection from "./school_selection";
import {
  useStudentDetails,
  useTeacherDetails,
  useUser,
} from "@/app/context/user_context";
import InspirationLoader from "@/app/components/loading";
import {
  User,
  ClipboardList,
  NotebookTabs,
  CheckSquare,
  NotepadTextIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getStudentDetails,
  getTeacherDetails,
} from "../api_functions/functions";

const background_color = "bg-gray-50 ";

export const Admin_Layout = ({ children }: { children: React.ReactNode }) => {
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
    <div className={`flex ${background_color}`}>
      <SideMenu links={links} SchoolSelect={SchoolSelection} />
      <Suspense fallback={<InspirationLoader />}>{children}</Suspense>
    </div>
  );
};

export const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setSchool } = useUser();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const { teacherDetails, setTeacherDetails } = useTeacherDetails();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  //
  //cehck if the teacher details are present,if not,fetch them
  useEffect(() => {
    if (status === "loading") return;

    if (!teacherDetails && session?.user?.id) {
      const fetchTeacherDetails = async () => {
        try {
          const teacher = await getTeacherDetails(session.user.id);
          if (teacher) {
            setUser(session.user);
            setSchool(session.user.school);
            setTeacherDetails(teacher);
          }
        } catch (error) {
          console.error("Failed to fetch teacher details:", error);
        }
      };

      fetchTeacherDetails();
    }
  }, [session, status, teacherDetails, setTeacherDetails, setSchool, setUser]);

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
    <div className={`flex ${background_color}`}>
      <SideMenu links={links} />
      <Suspense fallback={<InspirationLoader />}>{children}</Suspense>
    </div>
  );
};

export const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex">{children}</div>;
};

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const { studentDetails, setStudentDetails } = useStudentDetails();
  const { setUser, setSchool } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  //
  //cehck if the teacher details are present,if not,fetch them
  useEffect(() => {
    if (status === "loading") return;

    if (!studentDetails && session?.user?.id) {
      const fetchstudentDetails = async () => {
        try {
          const student = await getStudentDetails(session.user.id);
          if (student) {
            setUser(session.user);
            setSchool(session.user.school);
            setStudentDetails(student);
          }
        } catch (error) {
          console.error("Failed to fetch teacher details:", error);
        }
      };

      fetchstudentDetails();
    }
  }, [session, status, studentDetails, setStudentDetails, setSchool, setUser]);

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
      label: "Attendance",
      icon: <CheckSquare />,
      action: () => {
        router.push(createUrl(`/${basePath}/attendance`));
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
    <div className={`flex ${background_color}`}>
      <SideMenu links={links} />

      <Suspense fallback={<InspirationLoader />}>{children}</Suspense>
    </div>
  );
};

export const PrinciPalLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const links: MenuLink[] = [
    {
      label: "Dashboard",
      action: () => {
        router.push("/admin");
      },
    },
    {
      label: "Reports",
      action: () => {
        router.push("/admin/reports");
      },
    },
    {
      label: "Schedule",
      action: () => {
        router.push("/admin/schedule");
      },
    },
    {
      label: "Operations",
      action: () => {
        router.push("/admin/operations");
      },
    },
    {
      label: decodeURIComponent(searchParams.get("name") || ""),
      icon: <User />,
      action: () => {
        router.push(`/admin/profile`);
      },
    },
  ];

  return (
    <div className={`flex ${background_color}`}>
      <SideMenu links={links} />
      <Suspense fallback={<InspirationLoader />}>{children}</Suspense>
    </div>
  );
};
