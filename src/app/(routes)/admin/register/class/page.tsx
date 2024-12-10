"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const ClassLevel = () => {
  const name = Validation("", [required]);
  const grade_level = Validation("", [required]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name, grade_level].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: name.value,
            grade_level: grade_level.value,
          },
          model_name: "class_level",
        }),
      });
    },
    [name, grade_level]
  );

  return (
    <Form
      title="Register Class Level"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Class Name"
        placeholder="Enter Class Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <Input
        label="Grade Level"
        placeholder="Enter Grade Level"
        required
        value={grade_level.value}
        onChange={grade_level.handle_change}
        error={grade_level.error}
      />
    </Form>
  );
};

export default ClassLevel;
