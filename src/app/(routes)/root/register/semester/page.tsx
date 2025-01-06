"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";
const table_name = "academic_year";
//
// Semester Registration Component
const Semester = () => {
  const start_date = useValidation({ type: FieldType.Date, required: true });
  const end_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: start_date.formatted_date as Date | undefined,
  });

  const { school_id } = useUser();
  //
  //need to get the academic year id
  //we can get the year through the start_date or end_date value
  //we can get the academic year id by querying the academic_year table using the year and school_id
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!school_id) {
        alert("Please select a school");
        return;
      }

      if (!validInputs([start_date, end_date])) return;
      //
      //get the academic year id
      //use the year from the start_date or end_date value
      //use the school_id from the selected school
      //?table_name=users&name=John&age=30
      const year = start_date.value.toString().split("-")[0];
      const response = await fetch(
        `http://localhost:3000/api/fetch_record?table_name=${table_name}&school_id=${school_id}&year=${year}`
      );
      if (!response.ok) {
        alert(`Failed to fetch ${table_name}`);
        throw new Error(`Failed to fetch ${table_name}`);
      }
      //
      //get the academic year id
      const academic_year_id = await response.json();
      //
      //generate a name for the semester
      // use the start_month and end_month from the start_date and end_date value
      //use the year from the start_date value
      //use the school_id from the selected school
      //use the academic_year_id from the selected academic year
      const name = `${start_date.value.toString().split("-")[1]}-${
        end_date.value.toString().split("-")[1]
      }-${year}-${school_id}`;

      await register({
        data: {
          academic_year_id: academic_year_id[0]?.id,
          name: name,
          start_date: start_date.formatted_date,
          end_date: end_date.formatted_date,
        },
        model_name: "semester",
      });
    },
    [start_date, end_date, school_id]
  );

  return (
    <Form
      title="Register Semester"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
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
