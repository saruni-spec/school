//
//Currently not in use
"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";
import CheckBoxToggle from "@/app/components/checkbox_toggle";
import { grade_levels, MyRecord } from "@/app/types/types";
import { grade_level_type } from "@prisma/client";
//
// Register a class level
const ClassLevel = () => {
  //
  //get the current year
  const current_year = new Date().getFullYear();
  const class_year = Validation(`${current_year}`, [required]);
  const current = Validation("", []);
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
          class_group_id: class_id,
          name: "Default Stream",
        },
        model_name: "stream",
      }),
    });
  };

  //
  //create a class_group
  const createClassGroup = useCallback(async () => {
    // Create default stream
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: `${grade_level.value}-${class_year.value}-${school_id}`,
        },
        model_name: "class_group",
      }),
    });

    return await response.json();
  }, [grade_level, class_year, school_id]);

  const createClassProgression = useCallback(
    async (class_group_response: MyRecord, academic_year?: MyRecord) => {
      // Create class
      const class_response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            class_group_id: class_group_response.id,
            academic_year_id: academic_year?.id,
            grade_level_id: grade_levels[grade_level.value as grade_level_type],
            is_current: current.value === "on",
          },
          model_name: "class_progression",
        }),
      });

      return await class_response.json();
    },
    [grade_level, current]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [class_year, grade_level].every((field) =>
        field.validate(field.value)
      );

      if (!is_form_valid) return;

      try {
        //
        //create the class group
        const class_group_response: MyRecord = await createClassGroup();

        //
        // Fetch academic year
        const academic_year_response = await fetch(
          `http://localhost:3000/api/fetch_record?table_name=academic_year&school_id=${school_id}&year=${class_year.value}`
        );
        const academic_year: MyRecord[] = await academic_year_response.json();

        //
        // Create class
        const class_result = await createClassProgression(
          class_group_response,
          academic_year[0]
        );

        if (class_result.error) {
          console.error("Error creating class:", class_result.error);
          return;
        }
        //
        // Create default stream
        await createDefaultStream(class_group_response.id);

        // Handle successful creation (e.g., show success message, reset form)
      } catch (error) {
        console.error("Error creating class or stream:", error);
        // Handle error (e.g., show error message)
      }
    },
    [
      class_year,
      grade_level,
      school_id,
      createClassGroup,
      createClassProgression,
    ]
  );

  return (
    <Form
      title="Register Class Level"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
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

      <CheckBoxToggle
        label="Is this the class currently in this grade level?"
        required
        onChange={current.handle_change}
        error={current.error}
      />

      <Input
        label="Year"
        placeholder="Year eg, 2021..."
        required
        value={class_year.value}
        onChange={class_year.handle_change}
        error={class_year.error}
      />
    </Form>
  );
};

export default ClassLevel;
