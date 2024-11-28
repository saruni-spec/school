import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { DatePicker, useDateValidation } from "@/app/components/calendar";

const Fee = () => {
  const fee_type_id = Validation("", []);
  const amount = Validation("", [required]);
  const due_date = useDateValidation("", { minDate: new Date() });
  const semester_id = Validation("", [required]);
  const class_id = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [amount, semester_id].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            fee_type_id: fee_type_id.value ? parseInt(fee_type_id.value) : null,
            amount: parseFloat(amount.value),
            due_date: due_date.value || null,
            semester_id: parseInt(semester_id.value),
            class_id: class_id.value ? parseInt(class_id.value) : null,
          },
          model_name: "fee",
        }),
      });
    },
    [fee_type_id, amount, due_date, semester_id, class_id]
  );

  return (
    <Form
      title="Register Fee"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Fee Type ID"
        placeholder="Enter Fee Type ID (Optional)"
        value={fee_type_id.value}
        onChange={fee_type_id.handle_change}
        error={fee_type_id.error}
      />
      <Input
        label="Amount"
        placeholder="Enter Fee Amount"
        required
        type="number"
        value={amount.value}
        onChange={amount.handle_change}
        error={amount.error}
      />
      <DatePicker
        label="Due Date"
        placeholder="Enter Due Date (Optional)"
        type="date"
        minDate={new Date()}
        value={due_date.value}
        onChange={due_date.handle_change}
        error={due_date.error}
      />
      <Input
        label="Semester ID"
        placeholder="Enter Semester ID"
        required
        value={semester_id.value}
        onChange={semester_id.handle_change}
        error={semester_id.error}
      />
      <Input
        label="Class ID"
        placeholder="Enter Class ID (Optional)"
        value={class_id.value}
        onChange={class_id.handle_change}
        error={class_id.error}
      />
    </Form>
  );
};

export default Fee;
