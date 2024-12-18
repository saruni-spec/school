"use client";
import { Form } from "@/app/components/form";
import React from "react";
import { useCallback, useState } from "react";
import { Input } from "@/app/components/input";
import { DatePicker } from "@/app/components/calendar";
import { SearchDb } from "@/app/components/search_db";
import { FieldType, record } from "@/app/types/types";
import { findUnpaidFees } from "@/app/actions/actions";
import { SelectList } from "@/app/components/select_list";
import { Select } from "@/app/components/select";
import { payment_method } from "@prisma/client";
import { register } from "@/app/api_functions/functions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
//
// Add a new payment for a user
const Payment = () => {
  const fee_id = useValidation({ type: FieldType.Text, required: true });
  const amount = useValidation({ type: FieldType.Text, required: true });
  const payment_date = useValidation({
    type: FieldType.Text,
    required: true,
    maxDate: new Date(),
  });
  const pay_method = useValidation({ type: FieldType.Text, required: true });
  const reference_number = useValidation({
    type: FieldType.Text,
    required: true,
  });

  const payment_methods = Object.keys(payment_method);

  const [payed_by, setPayedBy] = useState<record | null>(null);
  const [fees, setFees] = useState<unknown>();
  const [selectedFee, setSelectedFee] = useState<record>();
  //
  // Handle the selection of the user to pay fees for
  const hanlePayedBy = async (item: record) => {
    setPayedBy(item);
    const fees = await findUnpaidFees(item);
    setFees(fees);
  };

  //
  // Handle the selection of the fee to pay
  const handleFeeSelection = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    fee_id.handle_change(e);
    const fee_selected = fees.find(
      (fee) => (fee.id = parseInt(e.target.value))
    );
    setSelectedFee(fee_selected);
  };
  //
  // Handle the form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !validInputs([
          fee_id,
          amount,
          payment_date,
          pay_method,
          reference_number,
        ])
      )
        return;
      //
      //determine the status of the payment depending on the amount paid
      //pending,completed or overpaid
      let status = "PENDING";
      if (
        parseFloat(amount.value as string) ===
        parseFloat(selectedFee?.fee_amount as string)
      ) {
        status = "COMPLETED";
      }
      if (
        parseFloat(amount.value as string) >
        parseFloat(selectedFee?.fee_amount as string)
      ) {
        status = "OVERPAID";
      }

      await register({
        data: {
          paid_by: payed_by?.id,
          fee_payee_id: selectedFee?.fee_id,
          amount: parseFloat(amount.value as string),
          payment_date: payment_date.formatted_date || null,
          payment_method: pay_method.value,
          status: status,
          reference_number: reference_number.value,
        },
        model_name: "payment",
      });
    },
    [
      fee_id,
      amount,
      payment_date,
      pay_method,
      reference_number,
      payed_by,
      selectedFee,
    ]
  );

  return (
    <Form title="Payment" onSubmit={handleSubmit} submitButtonText="Submit">
      <SearchDb display_fields={["name", "phone"]} onSelect={hanlePayedBy} />
      <Select
        options={fees as record[]}
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
