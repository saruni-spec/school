import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { Form } from "@/app/components/form";
import { MultiInput } from "@/app/components/multi_input";
import { required, validateKey, validateValue } from "@/app/hooks/validation";
import React, { useCallback, useState } from "react";

const Student = () => {
  //get the birth date od the student
  //the max possible date is today,and the field is required
  const date_of_birth = useDateValidation("", {
    maxDate: new Date(),
    customValidator: () => required(date_of_birth.value),
  });
  const [medical_info, set_medical_info] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [date_of_birth].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { date_of_birth, medical_info, users_id },
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
      <MultiInput
        label="Medical Information"
        placeholder="Enter Medical Information"
        value={medical_info}
        onChange={set_medical_info}
        keyPlaceholder="Contact Type (email, phone)"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
    </Form>
  );
};

export default Student;
