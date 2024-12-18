"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { useUser } from "@/app/context/user_context";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";
//
//Register departments
const Department = () => {
  const name = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text });
  const { school_id } = useUser();
  //
  // Register a department
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate the input fields
      if (!validInputs([name, description])) return;

      await register({
        data: {
          school_id: school_id,
          name: name.value,
          description: description.value,
        },
        model_name: "department",
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
