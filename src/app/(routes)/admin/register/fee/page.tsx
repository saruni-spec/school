"use client";
import React, { useEffect, useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { Select } from "@/app/components/select";

const Fee = () => {
  const fee_type_id = Validation("", []);
  const amount = Validation("", [required]);
  const due_date = useDateValidation("", true, new Date());
  const semester_id = Validation("", [required]);
  const [feeTypes, setFeeTypes] = useState();
  const { school_id } = useUser();

  //
  //get the fee types
  const getFeeTypes = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/fetch_record?table_name=fee_type&school_id=${school_id}`
    );
    const results = await response.json();
    console.log(results);
    setFeeTypes(results.records);
  }, [school_id]);

  useEffect(() => {
    getFeeTypes();
  }, [getFeeTypes]);

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
            fee_type_id: fee_type_id.value,
            amount: amount.value,
            due_date: due_date.value,
            semester_id: semester_id.value,
          },
          model_name: "fee",
        }),
      });
    },
    [fee_type_id, amount, due_date, semester_id]
  );

  return (
    <Form
      title="Register Fee"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
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
      {feeTypes && (
        <Select
          options={feeTypes}
          value={fee_type_id.value}
          onChange={fee_type_id.handle_change}
          error={fee_type_id.error}
          label="Fee Type"
        />
      )}
    </Form>
  );
};

export default Fee;
