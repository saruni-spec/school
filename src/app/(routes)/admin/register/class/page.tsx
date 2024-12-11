"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";

const ClassLevel = () => {
  const class_year = Validation("", [required]);
  const grade_level = Validation("", [required]);
  const { school_id } = useUser();

  //
  //handle default stream creation
  const createDefaultStream = async (class_id: number) => {
    // Create default stream
    await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          class_id: class_id,
          name: "Default Stream",
        },
        model_name: "stream",
      }),
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [class_year, grade_level].every((field) =>
        field.validate(field.value)
      );

      if (!is_form_valid) return;

      try {
        // Fetch academic year
        const academic_year_response = await fetch(
          `http://localhost:3000/api/fetch_record?table_name=academic_year&school_id=${school_id}&year=${class_year.value}`
        );
        const academic_year_data = await academic_year_response.json();
        const academic_year_id = academic_year_data.records;

        // Create class
        const class_response = await fetch(
          "http://localhost:3000/api/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                academic_year_id: academic_year_id?.id,
                name: `${grade_level.value}-${class_year.value}-${school_id}`,
                grade_level: grade_level.value,
              },
              model_name: "class_level",
            }),
          }
        );

        const class_result = await class_response.json();

        if (class_result.error) {
          console.error("Error creating class:", class_result.error);
          return;
        }

        // Create default stream
        await createDefaultStream(class_result.id);

        // Handle successful creation (e.g., show success message, reset form)
      } catch (error) {
        console.error("Error creating class or stream:", error);
        // Handle error (e.g., show error message)
      }
    },
    [class_year, grade_level, school_id]
  );

  return (
    <Form
      title="Register Class Level"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Year"
        placeholder="Year eg, 2021..."
        required
        value={class_year.value}
        onChange={class_year.handle_change}
        error={class_year.error}
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
