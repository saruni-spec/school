"use client";
import { getDataFromApi, register } from "@/app/api_functions/functions";
import { DatePicker } from "@/app/components/calendar";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import { useUser } from "@/app/context/user_context";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { exam_type } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";

const exam_types = Object.keys(exam_type);

const RegisterExam = () => {
  const [semester_id, setSemesterId] = useState();

  const name = useValidation({ type: FieldType.Text, required: true });
  const exam_providers = useValidation({
    type: FieldType.Text,
    required: true,
  });
  const start_date = useValidation({ type: FieldType.Date, required: true });
  const end_date = useValidation({ type: FieldType.Date, required: true });
  const type = useValidation({ type: FieldType.Text, required: true });

  const { school_id } = useUser();
  //const semester_id
  const getCurrentSemester = useCallback(async () => {
    if (!school_id) return;

    const data = await getDataFromApi(
      `/api/semester/current?school_id=${school_id}`
    );
    if (!data) return;
    setSemesterId(data.id);
  }, [school_id]);

  useEffect(() => {
    getCurrentSemester();
  }, [getCurrentSemester]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the input fields
    if (!validInputs([name, exam_providers, start_date, end_date, type]))
      return;

    // Register the exam
    await register({
      data: {
        semester_id,
        name: name.value,
        exam_providers: exam_providers.value,
        start_date: start_date.value,
        end_date: end_date.value,
        type: type.value,
      },
      model_name: "exam",
    });
  };

  return (
    <Form onSubmit={handleSubmit} submitButtonText="Register Exam">
      <MyInput
        name="exam_name"
        label="Exam Name"
        placeholder="Enter Exam Name"
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <MyInput
        name="exam_provider"
        label="Exam Provider"
        placeholder="Enter Exam Provider"
        value={exam_providers.value}
        onChange={exam_providers.handle_change}
        error={exam_providers.error}
      />
      <DatePicker
        name="start_date"
        label="Start Date"
        placeholder="Enter Start Date"
        value={start_date.value}
        onChange={start_date.handle_change}
        error={start_date.error}
      />
      <DatePicker
        name="end_date"
        label="End Date"
        placeholder="Enter End Date"
        value={end_date.value}
        onChange={end_date.handle_change}
        error={end_date.error}
      />
      <SelectList
        options={exam_types}
        name="type"
        label="Type"
        placeholder="Enter Type"
        value={type.value}
        onChange={type.handle_change}
        error={type.error}
      />
    </Form>
  );
};

export default RegisterExam;
