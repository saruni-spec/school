"use client";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import Validation, { required, validatePassword } from "@/app/hooks/validation";
import React from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  usePrincipalDetails,
  useStudentDetails,
  useTeacherDetails,
  useUser,
} from "@/app/context/user_context";
import {
  getPrincipalDetails,
  getStudentDetails,
  getTeacherDetails,
} from "@/app/api_functions/functions";
import { role_type } from "@prisma/client";

type Route =
  | "admin"
  | "root"
  | "student"
  | "secretary"
  | "teacher"
  | "parent"
  | "staff"
  | "administative";
const routes: Record<Route, Array<role_type>> = {
  admin: [
    "SYSTEM_ADMINISTRATOR",
    "PRINCIPAL",
    "VICE_PRINCIPAL",
    "SCHOOL_ADMINISTRATOR",
  ],
  root: ["SYSTEM_ADMINISTRATOR"],
  student: ["STUDENT", "PARENT"],
  secretary: ["SECRETARY", "ADMINISTRATIVE_STAFF"],
  teacher: ["TEACHER"],
  parent: ["PARENT"],
  staff: ["ADMINISTRATIVE_STAFF", "FACULTY_MEMBER"],
  administative: [
    "ADMINISTRATIVE_STAFF",
    "ACADEMIC_REGISTRAR",
    "ADMISSIONS_OFFICER",
    "CURRICULUM_COORDINATOR",
    "EVENT_COORDINATOR",
    "EXAM_CONTROLLER",
    "FACILITY_MANAGER",
    "FINANCIAL_OFFICER",
    "HEAD_OF_DEPARTMENT",
    "HUMAN_RESOURCES_MANAGER",
    "INVENTORY_MANAGER",
    "LIBRARIAN",
    "SCHOOL_ADMINISTRATOR",
  ],
};

//Login component
const Login = () => {
  const router = useRouter();
  const { setUser, setSchool } = useUser();
  const { setTeacherDetails } = useTeacherDetails();
  const { setStudentDetails } = useStudentDetails();
  const { setPrincipalDetails } = usePrincipalDetails();
  //we require the email and password to login
  const identification = Validation("", [required]);
  const password = Validation("", [validatePassword, required]);

  // Create URL-safe query string
  const createQueryString = (
    params: Record<string, string | null | undefined>
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value ? value : "profile");
    });
    return searchParams.toString();
  };

  //submit the login form
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const inputs_valid =
      identification.validate(identification.value) &&
      password.validate(password.value);

    if (!inputs_valid) {
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirect
        id_code: identification.value,
        password: password.value,
      });

      if (result?.error) {
        identification.setError("Invalid email or password");
        password.setError("Invalid email or password");
        console.log("Login error:", result.error);
        return;
      }

      if (result?.ok) {
        // Successful login - redirect to a protected route
        const session = await getSession();
        if (!session) {
          alert("Login failed. Please try again.");
          return;
        }
        // Update user context with session data
        setUser(session.user);
        setSchool(session.user.school);

        const base_params = {
          name: session.user.name,
          id_code: session.user.id_code,
        };

        const query_string = createQueryString(base_params);

        switch (session.user.role) {
          case "SCHOOL_ADMINISTRATOR":
          case "PRINCIPAL":
          case "VICE_PRINCIPAL":
            const principal_details = await getPrincipalDetails(
              session.user.id
            );
            if (principal_details) {
              setPrincipalDetails(principal_details);
            }

            router.push(`/admin?${query_string}`);
            break;
          case "TEACHER":
            const teacher_details = await getTeacherDetails(session.user.id);
            if (teacher_details) {
              setTeacherDetails(teacher_details);
            }

            router.push(`/teacher?${query_string}`);
            break;
          case "STUDENT":
            const student_details = await getStudentDetails(session.user.id);
            if (student_details) {
              setStudentDetails(student_details);
            }

            router.push(`/student?${query_string}`);
            break;
          case "PARENT":
            router.push(`/parent?${query_string}`);
            break;
          case "SECRETARY":
            router.push(`/secretary?${query_string}`);
            break;
          case "ADMINISTRATIVE_STAFF":
            router.push(`/administative?${query_string}`);
          default:
            router.push(`/staff?${query_string}`);
        }
      }
    } catch (error) {
      console.log("Unexpected login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Form title="Sign In" onSubmit={handlesubmit} submitButtonText="Sign In">
      <MyInput
        label="Identification"
        value={identification.value}
        onChange={identification.handle_change}
        error={identification.error}
        placeholder="Enter your id code"
      />
      <MyInput
        label="Password"
        value={password.value}
        onChange={password.handle_change}
        error={password.error}
        placeholder="Enter your password"
        type="password"
      />
    </Form>
  );
};

export default Login;
