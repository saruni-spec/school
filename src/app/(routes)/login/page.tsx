import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, {
  validateEmail,
  validatePassword,
} from "@/app/hooks/validation";
import React from "react";
//
//Login component
const Login = () => {
  //we require the email and password to login
  const email = Validation("", [validateEmail]);
  const password = Validation("", [validatePassword]);

  //submit the login form
  const handlesubmit = async () => {
    //validate the email and password
    const inputs_valid =
      email.validate(email.value) && password.validate(password.value);
    if (!inputs_valid) {
      return;
    }
    try {
      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
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
