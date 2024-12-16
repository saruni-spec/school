"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";

const Semester = () => {
  const start_date = useDateValidation("", true);
  const end_date = useDateValidation(
    "",
    false,
    start_date.formatted_date ? start_date.formatted_date : undefined
  );
  const table_name = "academic_year";

  const { school_id } = useUser();

  //
  //need to get the academic year id
  //we can get the year through the start_date or end_date value
  //we can get the academic year id by querying the academic_year table using the year and school_id

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [start_date, end_date].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      //
      //get the academic year id
      //use the year from the start_date or end_date value
      //use the school_id from the selected school
      //?table_name=users&name=John&age=30
      const year = start_date.value.toString().split("-")[0];
      const response = await fetch(
        `http://localhost:3000/api/fetch_record?table_name=${table_name}&school_id=${school_id}&year=${year}`
      );
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

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            academic_year_id: academic_year_id[0]?.id,
            name: name,
            start_date: start_date.formatted_date,
            end_date: end_date.formatted_date,
          },
          model_name: "semester",
        }),
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
