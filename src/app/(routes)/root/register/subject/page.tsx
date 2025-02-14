"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";

const Subject = () => {
  const name = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validInputs([name, description])) return;

      await register({
        data: {
          name: name.value,
          description: description.value,
        },
        model_name: "subject",
      });
    },
    [name, description]
  );

  return (
    <Form
      title="Register Subject"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <MyInput
        label="Name"
        placeholder="Enter Subject Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <MyInput
        label="Description"
        placeholder="Enter Description (Optional)"
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
    </Form>
  );
};

export default Subject;
