"use client";
import React, { useEffect, useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { SelectList } from "@/app/components/select_list";
import { fee_type_enum, installment_types } from "@prisma/client";
import DynamicSelection from "@/app/components/dynamic_selection";

const Fee = () => {
  const stream_table = "stream";
  const grade_table = "grade";
  const department_table = "department";
  //

  const amount = Validation("", [required]);
  const fee_for = Validation("", [required]);
  const description = Validation("", []);
  const due_date = useDateValidation("", true, new Date());
  const installment_type = Validation("", [required]);
  const to_be_paid_by = useDateValidation("", true, new Date());
  const semester_id = Validation("", [required]);

  const fee_types: string[] = Object.keys(fee_type_enum);
  const installment_options = Object.keys(installment_types);
  const { school_id } = useUser();
  //
  //fees an be for individuals,streams,classes,department or the entire school
  const possibe_payees = [
    { id: 1, name: "Individuals" },
    { id: 2, name: "Streams" },
    { id: 3, name: "Classes" },
    { id: 4, name: "Department" },
    { id: 5, name: "School" },
  ];
  //
  //fetch the table data needed for different payee types
  const fetchPayeeData = useCallback(async (payee_type: record) => {
    let response;
    switch (payee_type.id) {
      case 2: {
        //
        //get all the streams in the school
        response = await fetch(
          `http://localhost:3000/api/fetch_record?table_name=${stream_table}&school_id=${school_id}`
        );
      }
      case 3: {
        //
        //get all the classes in the school
        response = await fetch(
          `http://localhost:3000/api/fetch_record?table_name=${grade_table}&school_id=${school_id}`
        );
      }
      case 4: {
        //
        //get all the departments in the school
        response = await fetch(
          `http://localhost:3000/api/fetch_record?table_name=${department_table}&school_id=${school_id}`
        );
      }
    }
  }, []);
  //
  //get the possible payees for the selected payee
  const getPayeeOptions = (selectedPayee: record) => {
    switch (selectedPayee.id) {
      case 1:
        return "search";
      //
      //get all the students in the school
      case 2: {
        //
        //get all the streams in the school
      }
      case 3:
      //
      //get all the classes in the school
      case 4:
      //
      //get all the departments in the school
      case 5:
      //
      //get the school
      default:
        return [];
    }
  };

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
    [amount, due_date, semester_id]
  );

  return (
    <Form
      title="Register Fee"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <SelectList
        label="Fee Type"
        options={fee_types}
        value={fee_for.value}
        onChange={fee_for.handle_change}
        error={fee_for.error}
      />
      <Input
        label="Description"
        placeholder="Enter Fee Description"
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
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
        value={due_date.value}
        onChange={due_date.handle_change}
        error={due_date.error}
      />
      <SelectList
        label="Installment Type"
        options={installment_options}
        value={installment_type.value}
        onChange={installment_type.handle_change}
        error={installment_type.error}
      />
      <DynamicSelection
        radioOptions={possibe_payees}
        getCheckboxOptions={}
        onSubmit={}
      />
    </Form>
  );
};

export default Fee;
