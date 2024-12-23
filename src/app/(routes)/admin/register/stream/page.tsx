"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { useUser } from "@/app/context/user_context";
import { getGradeLevels } from "@/app/actions/actions";
import { FieldType, record } from "@/app/types/types";
import { Select } from "@/app/components/select";
import { useValidation } from "@/app/hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";
//
// Stream Registration Component
const Stream = () => {
  const stream_name = useValidation({ type: FieldType.Text, required: true });
  const capacity = useValidation({ type: FieldType.Number });
  const grade_level_id = useValidation({
    type: FieldType.Text,
    required: true,
  });

  const { school_id } = useUser();

  const [grade_levels, setGradeLevels] = useState<record[]>([]);

  //
  //get the grade levels in the school
  const getGrades = useCallback(async () => {
    const grades = await getGradeLevels(school_id);

    setGradeLevels(grades);
  }, [school_id]);

  useEffect(() => {
    getGrades();
  }, [getGrades]);

  //
  //fetch current academic year
  const currentAcademicYear = useCallback(async () => {
    const respone = await fetch(
      `/api/academic_year/current?school_id=${school_id}`
    );
    return await respone.json();
  }, [school_id]);

  //
  //submit the form
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validInputs([stream_name, capacity, grade_level_id])) return;

      const response = await register({
        data: {
          school_id: school_id,
          name: stream_name.value,
          capacity: capacity.value ? parseInt(capacity.value as string) : null,
          grade_level_id: parseInt(grade_level_id.value as string),
        },
        model_name: "stream",
      });

      const academic_year = await currentAcademicYear();

      await register({
        data: {
          stream_id: response.id,
          academic_year_id: academic_year.id,
          is_current: true,
          name: `${stream_name.value} ${academic_year.year}`,
        },
        model_name: "class_progression",
      });
    },
    [stream_name, capacity, grade_level_id, school_id, currentAcademicYear]
  );

  return (
    <Form
      title="Register Stream"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Select
        label="Grade Level"
        show_field={"level"}
        options={grade_levels}
        value={grade_level_id.value}
        onChange={grade_level_id.handle_change}
        error={grade_level_id.error}
      />
      <Input
        label="Stream Name"
        placeholder="Enter Stream Name"
        required
        value={stream_name.value}
        onChange={stream_name.handle_change}
        error={stream_name.error}
      />
      <Input
        label="Capacity"
        placeholder="Enter Capacity (Optional)"
        type="number"
        value={capacity.value}
        onChange={capacity.handle_change}
        error={capacity.error}
      />
    </Form>
  );
};

export default Stream;
