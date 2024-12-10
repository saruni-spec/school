"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import Validation, { required } from "@/app/hooks/validation";
import SchoolSelection from "@/app/components/school_selection";
import { record } from "@/app/types/types";

const ClassLevel = () => {
  const name = Validation("", [required]);
  const grade_level = Validation("", [required]);
  const school_id = Validation("", [required]);
  //
  //get the school id of the selcted school
  const school_selection = useCallback(
    (selectedSchool: record) => {
      school_id.handle_value_change(selectedSchool.id);
    },
    [school_id]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name, grade_level].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: name.value,
            grade_level: grade_level.value,
          },
          model_name: "class_level",
        }),
      });
    },
    [name, grade_level, school_id]
  );

  return (
    <Form
      title="Register Class Level"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <SchoolSelection onSchoolSelect={school_selection} />
      <Input
        label="Class Name"
        placeholder="Enter Class Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />

      <SelectList
        options={[
          "PRE_PRIMARY_1",
          "PRE_PRIMARY_2",
          "GRADE_1",
          "GRADE_2",
          "GRADE_3",
          "GRADE_4",
          "GRADE_5",
          "GRADE_6",
          "GRADE_7",
          "GRADE_8",
          "GRADE_9",
          "GRADE_10",
          "GRADE_11",
          "GRADE_12",
        ]}
        label="Grade"
        placeholder="Grade level ed,GRADE_1,GRADE_2..."
        required
        value={grade_level.value}
        onChange={grade_level.handle_change}
        error={grade_level.error}
      />
    </Form>
  );
};

export default ClassLevel;
