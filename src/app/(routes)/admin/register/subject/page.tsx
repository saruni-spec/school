"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const Subject = () => {
  const name = Validation("", [required]);
  const code = Validation("", []);
  const description = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            department_id: department_id,
            name: name.value,
            code: code.value,
            description: description.value,
          },
          model_name: "subject",
        }),
      });
    },
    [name, code, description]
  );

  return (
    <Form
      title="Register Subject"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Name"
        placeholder="Enter Subject Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <Input
        label="Code"
        placeholder="Enter Subject Code (Optional)"
        value={code.value}
        onChange={code.handle_change}
        error={code.error}
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

export default Subject;
