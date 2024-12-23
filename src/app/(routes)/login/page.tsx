"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required, validatePassword } from "@/app/hooks/validation";
import React from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTeacherDetails, useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";

//Login component
const Login = () => {
  const router = useRouter();
  const { setUser, setSchool } = useUser();
  const { setTeacherDetails } = useTeacherDetails();
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

  //
  // get teacher specific details
  const getTeacherDetails = async (user_id: number): Promise<record | null> => {
    try {
      const response = await fetch(`/api/teacher/${user_id}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: record = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      console.log("Error fetching teacher details. Please try again.");
      return null;
    }
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
          case "SYSTEM_ADMINISTRATOR":
          case "SCHOOL_ADMINISTRATOR":
          case "PRINCIPAL":
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
          case "PARENT":
            router.push(`/student?${query_string}`);
            break;
          case "SECRETARY":
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
      <Input
        label="Identification"
        value={identification.value}
        onChange={identification.handle_change}
        error={identification.error}
        placeholder="Enter your id code"
      />
      <Input
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
