"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";

const AcademicYear = () => {
  const name = Validation("", [required]);
  const start_date = useDateValidation("", true);
  const end_date = useDateValidation(
    "",
    false,
    start_date.formatted_date ? start_date.formatted_date : undefined
  );
  const { school_id } = useUser();

  //
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name, start_date, end_date].every((field) =>
        field.validate(field.value.toString())
      );
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            year: name.value,
            start_date: start_date.formatted_date,
            end_date: end_date.formatted_date,
          },
          model_name: "academic_year",
        }),
      });
    },
    [name, start_date, end_date, school_id]
  );

  return (
    <Form
      title="Academic Year Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <Input
        label="Academic Year"
        placeholder="Enter Academic Year eg 2025..."
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <DatePicker
        label="Start Date"
        value={start_date.value}
        onChange={start_date.handle_change}
        error={start_date.error}
        required
      />
      <DatePicker
        label="End Date"
        value={end_date.value}
        onChange={end_date.handle_change}
        error={end_date.error}
        required
      />
    </Form>
  );
};

export default AcademicYear;
