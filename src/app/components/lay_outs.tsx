import React, { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuLink } from "../types/types";
import SideMenu from "./side_menu";
import SchoolSelection from "./school_selection";
import {
  usePrincipalDetails,
  useStudentDetails,
  useTeacherDetails,
  useUser,
} from "@/app/context/user_context";
import InspirationLoader from "@/app/components/loading";
import { User, ClipboardList, NotebookTabs, CheckSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getPrincipalDetails as getSecretaryDetails,
  getStudentDetails,
  getTeacherDetails,
} from "../api_functions/functions";

const background_color = "bg-gray-50 ";

export const Admin_Layout = ({ children }: { children: React.ReactNode }) => {
  const route = "/root";
  const router = useRouter();
  const links: MenuLink[] = [
    {
      label: "Dashboard",
      action: () => {
        router.push(`${route}`);
      },
    },
    {
      label: "Register",
      action: () => {
        router.push(`${route}/register`);
      },
    },
    {
      label: "View",
      action: () => {
        router.push(`${route}/view`);
      },
    },
    {
      label: "Update",
      action: () => {
        router.push(`${route}/update`);
      },
    },
    {
      label: "Review",
      action: () => {
        router.push(`${route}/review`);
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
  const { setUser, setSchool, user } = useUser();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const { teacherDetails, setTeacherDetails } = useTeacherDetails();
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
          if (!teacher) {
            router.push("/login");
            return;
          }
          setUser(session.user);
          setSchool(session.user.school);
          setTeacherDetails(teacher);
        } catch (error) {
          console.error("Failed to fetch teacher details:", error);
        }
      };

      fetchTeacherDetails();
    }
  }, [
    session,
    status,
    teacherDetails,
    setTeacherDetails,
    setSchool,
    setUser,
    router,
  ]);

  // Get the base path (e.g., /teacher)
  const basePath = pathname.split("/")[1];

  // Create a function to preserve and encode query parameters
  const createUrl = (path: string) => {
    if (!user) return "";
    const params = new URLSearchParams();

    // Preserve all existing query parameters

    params.append("id", user.id.toString());

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
      label: user ? (user.name as string) : "",
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
  const { setUser, setSchool, user } = useUser();
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
          if (!student) {
            router.push("/login");
            return;
          }
          setUser(session.user);
          setSchool(session.user.school);
          setStudentDetails(student);
        } catch (error) {
          console.error("Failed to fetch teacher details:", error);
        }
      };

      fetchstudentDetails();
    }
  }, [
    session,
    status,
    studentDetails,
    setStudentDetails,
    setSchool,
    setUser,
    router,
  ]);

  // Get the base path (e.g., /teacher)
  const basePath = pathname.split("/")[1];

  // Create a function to preserve and encode query parameters
  const createUrl = (path: string) => {
    if (!user) return "";
    const params = new URLSearchParams();

    // Preserve all existing query parameters

    params.append("id", user.id.toString());

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
      label: user ? (user.name as string) : "",
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
  const { principalDetails, setPrincipalDetails } = usePrincipalDetails();
  const { setUser, setSchool, user } = useUser();
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

    if (!principalDetails && session?.user?.id) {
      const fetchPrincipalDetails = async () => {
        try {
          const principal = await getSecretaryDetails(session.user.id);
          if (!principal) {
            router.push("/login");
            return;
          }
          setUser(session.user);
          setSchool(session.user.school);
          setPrincipalDetails(principal);
        } catch (error) {
          console.error("Failed to fetch teacher details:", error);
        }
      };

      fetchPrincipalDetails();
    }
  }, [
    session,
    status,
    setSchool,
    setUser,
    principalDetails,
    setPrincipalDetails,
    router,
  ]);

  // Get the base path (e.g., /teacher)
  const basePath = pathname.split("/")[1];

  // Create a function to preserve and encode query parameters
  const createUrl = (path: string) => {
    if (!user) return "";
    const params = new URLSearchParams();

    // Preserve all existing query parameters

    params.append("id", user.id.toString());

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
      label: "Reports",
      action: () => {
        router.push(createUrl(`/${basePath}/reports`));
      },
    },
    {
      label: "Schedule",
      action: () => {
        router.push(createUrl(`/${basePath}/schedule`));
      },
    },
    {
      label: "Operations",
      action: () => {
        router.push(createUrl(`/${basePath}/operations`));
      },
    },
    {
      label: user ? (user.name as string) : "",
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
