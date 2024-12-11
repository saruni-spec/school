"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import Validation, { required } from "@/app/hooks/validation";
import { record } from "@/app/types/types";
import SchoolSelection from "@/app/components/school_selection";
import { useUser } from "@/app/context/user_context";

const Semester = () => {
  const name = Validation("", [required]);
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
      const is_form_valid = [name, start_date, end_date].every((field) =>
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
      const data = await response.json();
      const academic_year_id = data.records;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            academic_year_id: academic_year_id?.id,
            name: name.value,
            start_date: start_date.formatted_date,
            end_date: end_date.formatted_date,
          },
          model_name: "semester",
        }),
      });
    },
    [name, start_date, end_date, school_id]
  );

  return (
    <Form
      title="Register Semester"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <SchoolSelection onSchoolSelect={school_selection} />
      <Input
        label="Semester Name"
        placeholder="Enter Semester Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
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
