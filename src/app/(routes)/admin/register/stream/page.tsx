"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";
import { getGradeLevels } from "@/app/actions/actions";
import { record } from "@/app/types/types";
import { Select } from "@/app/components/select";

const Stream = () => {
  const stream_name = Validation("", [required]);
  const capacity = Validation("", []);
  const grade_level_id = Validation("", [required]);
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [stream_name, capacity].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: stream_name.value,
            capacity: capacity.value
              ? parseInt(capacity.value as string)
              : null,
            grade_level_id: parseInt(grade_level_id.value as string),
          },
          model_name: "stream",
        }),
      });
    },
    [stream_name, capacity, grade_level_id, school_id]
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
