"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, {
  validateEmail,
  validatePassword,
} from "@/app/hooks/validation";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

//Login component
const Login = () => {
  const router = useRouter();

  //we require the email and password to login
  const email = Validation("", [validateEmail]);
  const password = Validation("", [validatePassword]);

  //submit the login form
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const inputs_valid =
      email.validate(email.value) && password.validate(password.value);

    if (!inputs_valid) {
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirect
        email: email.value,
        password: password.value,
      });

      if (result?.error) {
        email.setError("Invalid email or password");
        password.setError("Invalid email or password");
        console.log("Login error:", result.error);
        return;
      }

      if (result?.ok) {
        // Successful login - redirect to a protected route
        router.push("/"); // Adjust route as needed
      }
    } catch (error) {
      console.log("Unexpected login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Form title="Sign In" onSubmit={handlesubmit} submitButtonText="Sign In">
      <Input
        type="email"
        label="Email"
        value={email.value}
        onChange={email.handle_change}
        error={email.error}
        placeholder="Enter your email"
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
