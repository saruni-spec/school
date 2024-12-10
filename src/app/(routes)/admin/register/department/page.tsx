"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const Department = () => {
  const name = Validation("", [required]);
  const description = Validation("", []);
  const head_of_department = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name, description, head_of_department].every(
        (field) => field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: name.value,
            description: description.value,
            head_of_department: head_of_department.value || null,
          },
          model_name: "department",
        }),
      });
    },
    [name, description, head_of_department]
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
      <Input
        label="Head of Department"
        placeholder="Enter Head of Department ID (Optional)"
        value={head_of_department.value}
        onChange={head_of_department.handle_change}
        error={head_of_department.error}
      />
    </Form>
  );
};

export default Department;
