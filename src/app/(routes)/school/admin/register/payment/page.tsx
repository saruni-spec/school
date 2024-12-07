import { Form } from "@/app/components/form";
import React from "react";
import { useCallback } from "react";
import Validation, { required } from "@/app/hooks/validation";
import { useDateValidation } from "@/app/components/calendar";
import { Input } from "@/app/components/input";
import { DatePicker } from "@/app/components/calendar";

const Payment = () => {
  const fee_id = Validation("", [required]);
  const amount = Validation("", [required]);
  const payment_date = useDateValidation("", { minDate: new Date() });
  const payment_method = Validation("", [required]);
  const status = Validation("", [required]);
  const reference_number = Validation("", [required]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [
        fee_id,
        amount,
        payment_date,
        payment_method,
        status,
        reference_number,
      ].every((field) => field.validate(field.value));
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            student_id: student_id,
            fee_id: fee_id.value ? parseInt(fee_id.value) : null,
            amount: parseFloat(amount.value),
            payment_date: payment_date.value || null,
            payment_method: payment_method.value,
            status: status.value,
            reference_number: reference_number.value,
          },
          model_name: "payment",
        }),
      });
    },
    [fee_id, amount, payment_date, payment_method, status, reference_number]
  );

  return (
    <Form title="Payment" onSubmit={handleSubmit} submitButtonText="Submit">
      <Input
        label="Fee ID"
        placeholder="Enter Fee ID"
        required
        value={fee_id.value}
        onChange={fee_id.handle_change}
        error={fee_id.error}
      />
      <Input
        label="Amount"
        placeholder="Enter Amount"
        required
        value={amount.value}
        onChange={amount.handle_change}
        error={amount.error}
      />
      <DatePicker
        label="Payment Date"
        placeholder="Enter Payment Date"
        required
        type="date"
        value={payment_date.value}
        onChange={payment_date.handle_change}
        error={payment_date.error}
      />
      <Input
        label="Payment Method"
        placeholder="Enter Payment Method"
        required
        value={payment_method.value}
        onChange={payment_method.handle_change}
        error={payment_method.error}
      />
      <Input
        label="Status"
        placeholder="Enter Status"
        required
        value={status.value}
        onChange={status.handle_change}
        error={status.error}
      />

      <Input
        label="Reference Number"
        placeholder="Enter Reference Number"
        required
        value={reference_number.value}
        onChange={reference_number.handle_change}
        error={reference_number.error}
      />
    </Form>
  );
};

export default Payment;
