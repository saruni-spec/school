"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import Validation, { required } from "@/app/hooks/validation";

const AcademicYear = () => {
  const name = Validation("", [required]);
  const start_date = useDateValidation("", { maxDate: new Date() });
  const end_date = useDateValidation("", { minDate: new Date() });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name, start_date, end_date].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { school_id, name, start_date, end_date },
          model_name: "academic_year",
        }),
      });
    },
    [name, start_date, end_date]
  );

  return (
    <Form
      title="Academic Year Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <Input
        label="Academic Year Name"
        placeholder="Enter Name"
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
