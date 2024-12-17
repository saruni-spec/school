"use client";
import { Form } from "@/app/components/form";
import React from "react";
import { useCallback, useState } from "react";
import Validation, { required } from "@/app/hooks/validation";
import { useDateValidation } from "@/app/components/calendar";
import { Input } from "@/app/components/input";
import { DatePicker } from "@/app/components/calendar";
import { SearchDb } from "@/app/components/search_db";
import { record } from "@/app/types/types";
import { findUnpaidFees } from "@/app/actions/actions";
import { SelectList } from "@/app/components/select_list";
import { Select } from "@/app/components/select";
import { payment_method } from "@prisma/client";

const Payment = () => {
  const fee_id = Validation("", [required]);
  const amount = Validation("", [required]);
  const payment_date = useDateValidation("", true, new Date());
  const pay_method = Validation("", [required]);
  const reference_number = Validation("", [required]);

  const payment_methods = Object.keys(payment_method);

  const [payed_by, setPayedBy] = useState<record | null>(null);
  const [fees, setFees] = useState<record[]>([]);
  const [selectedFee, setSelectedFee] = useState<record>();

  const hanlePayedBy = async (item: record) => {
    setPayedBy(item);

    const fees = await findUnpaidFees(item.id);
    setFees(fees);
  };

  //
  const handleFeeSelection = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    fee_id.handle_change(e);
    const fee_selected = fees.find(
      (fee) => (fee.id = parseInt(e.target.value))
    );
    console.log(fee_selected);
    setSelectedFee(fee_selected);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [
        fee_id,
        amount,
        payment_date,
        pay_method,
        reference_number,
      ].every((field) => field.validate(field.value));
      if (!is_form_valid) return;
      const status = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            paid_by: payed_by?.id,
            fee_payee_id: selectedFee?.fee_id,
            amount: parseFloat(amount.value as string),
            payment_date: payment_date.formatted_date || null,
            payment_method: pay_method.value,
            status:
              parseFloat(amount.value as string) ===
              parseFloat(selectedFee?.fee_amount as string)
                ? "COMPLETED"
                : "PENDING",
            reference_number: reference_number.value,
          },
          model_name: "payment",
        }),
      });
    },
    [fee_id, amount, payment_date, pay_method, reference_number, payed_by]
  );

  return (
    <Form title="Payment" onSubmit={handleSubmit} submitButtonText="Submit">
      <SearchDb display_fields={["name", "phone"]} onSelect={hanlePayedBy} />
      <Select
        options={fees}
        label="Fee ID"
        placeholder="Select fee to pay"
        show_field={"fee_type"}
        value={fee_id.value}
        onChange={handleFeeSelection}
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
      <SelectList
        label="Payment Method"
        placeholder="Enter Payment Method"
        options={payment_methods}
        value={pay_method.value}
        onChange={pay_method.handle_change}
        error={pay_method.error}
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
