"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

import { useUser } from "@/app/context/user_context";
//
//Register departments
const Department = () => {
  const name = Validation("", [required]);
  const description = Validation("", []);
  const { school_id } = useUser();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const is_form_valid = [name, description].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: name.value,
            description: description.value,
          },
          model_name: "department",
        }),
      });
    },
    [name, description, school_id]
  );

  return (
    <Form
      title="Register Department"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Department Name"
        placeholder="Enter Department Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <Input
        label="Description"
        placeholder="Enter Description (Optional)"
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
    </Form>
  );
};

export default Department;
