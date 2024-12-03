import React, { useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import Validation, {
  required,
  validateKey,
  validateValue,
} from "@/app/hooks/validation";
import { MultiInput } from "@/app/components/multi_input";

const Staff = () => {
  const employment_status = Validation("", [required]);
  const join_date = useDateValidation(`${new Date()}`, { maxDate: new Date() });

  const [qualifications, set_qualifications] = useState<Record<string, string>>(
    {}
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [employment_status, join_date].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id,
            department_id,
            user_id,
            employment_status,
            qualifications,
            join_date,
          },
          model_name: "staff",
        }),
      });
    },
    [employment_status, qualifications, join_date]
  );
  return (
    <Form title="" onSubmit={handleSubmit} submitButtonText="">
      <Input
        label="Current School Name"
        placeholder="Your Current School"
        required
        value={employment_status.value}
        onChange={employment_status.handle_change}
        error={employment_status.error}
      />
      <DatePicker
        label="Date Joining"
        value={join_date.value}
        onChange={join_date.handle_change}
        error={join_date.error || ""}
        maxDate={new Date()}
        required
      />
      <MultiInput
        label="Professional Qualifications"
        placeholder='Enter contact info (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={qualifications}
        onChange={set_qualifications}
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

export default Staff;
