import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import React, { useCallback } from "react";

const Student = () => {
  //get the birth date od the student
  //the max possible date is today,and the field is required
  const date_of_birth = useDateValidation("", {
    maxDate: new Date(),
    customValidator: () => required(date_of_birth.value),
  });
  const medical_info = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [date_of_birth, medical_info].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { date_of_birth, medical_info, user_id },
          model_name: "student",
        }),
      });
    },
    [date_of_birth, medical_info]
  );
  return (
    <Form title="" onSubmit={handleSubmit} submitButtonText="">
      <DatePicker
        label="DOB"
        value={date_of_birth.value}
        onChange={date_of_birth.handle_change}
        error={date_of_birth.error || ""}
        maxDate={new Date()}
        required
      />
      <Input
        label="Medical Information"
        placeholder="Enter Medical Information"
        required
        value={medical_info.value}
        onChange={medical_info.handle_change}
        error={medical_info.error}
      />
    </Form>
  );
};

export default Student;
