import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { DatePicker } from "@/app/components/calendar";
import Validation, { required } from "@/app/hooks/validation";

const Semester = () => {
  const name = Validation("", [required]);
  const start_date = Validation("", [required]);
  const end_date = Validation("", [required]);

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
          data: {
            academic_year_id: academic_year_id.value,
            name: name.value,
            start_date: start_date.value,
            end_date: end_date.value,
          },
          model_name: "semester",
        }),
      });
    },
    [name, start_date, end_date]
  );

  return (
    <Form
      title="Register Semester"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Semester Name"
        placeholder="Enter Semester Name"
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

export default Semester;
