"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation from "@/app/hooks/validation";
import React, { useCallback } from "react";

const User = () => {
  const first_name = Validation("", []);
  const last_name = Validation("", []);
  const email = Validation("", []);
  const phone = Validation("", []);
  const address = Validation("", []);
  const role = Validation("", []);
  const password = Validation("", []);
  const emergency_contacts = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [
        first_name,
        last_name,
        email,
        phone,
        address,
        role,
        password,
        emergency_contacts,
      ].every((field) => field.validate(field.value));
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            first_name,
            last_name,
            email,
            phone,
            address,
            role,
            password,
            emergency_contacts,
          },
          model_name: "users",
        }),
      });
    },
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      role,
      password,
      emergency_contacts,
    ]
  );
  return (
    <Form
      title="User Registration"
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
    >
      <Input
        label="First Name"
        onChange={first_name.handle_change}
        value={first_name.value}
        error={first_name.error}
      />
      <Input
        label="Last Name"
        onChange={last_name.handle_change}
        value={last_name.value}
        error={last_name.error}
      />
      <Input
        label="Email"
        onChange={email.handle_change}
        value={email.value}
        error={email.error}
      />
      <Input
        label="Phone Number"
        onChange={phone.handle_change}
        value={phone.value}
        error={phone.error}
      />
      <Input
        label="Address"
        onChange={address.handle_change}
        value={address.value}
        error={address.error}
      />

      <Input
        label="Password"
        onChange={password.handle_change}
        value={password.value}
        error={password.error}
      />
      <Input
        label="Emergency Contacts"
        onChange={emergency_contacts.handle_change}
        value={emergency_contacts.value}
        error={emergency_contacts.error}
      />
    </Form>
  );
};

export default User;
