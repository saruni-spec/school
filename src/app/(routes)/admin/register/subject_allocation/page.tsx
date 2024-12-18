"use client";
import { fetchTable } from "@/app/api_functions/functions";
import { Form } from "@/app/components/form";
import { Select } from "@/app/components/select";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType, record } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import { register } from "@/app/api_functions/functions";
import { validInputs } from "@/lib/functions";
//
// Subject Allocation Component
const SubjectAllocation = () => {
  const subject = useValidation({ type: FieldType.Text });
  const grade = useValidation({ type: FieldType.Text });

  const [subjects, setSubjects] = useState<record[]>([]);
  const [grades, setGrades] = useState<record[]>([]);

  //get the list of subjects
  const getSubjects = async () => {
    const response = await fetchTable("subject");
    setSubjects(response);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  //get the list of grades
  const getGrades = async () => {
    const response = await fetchTable("grade_level");
    setGrades(response);
  };

  useEffect(() => {
    getGrades();
  }, []);

  const handleSunmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validInputs([subject, grade])) return;
    //save the subject allocation
    await register({
      data: {
        subject_id: parseInt(subject.value as string),
        grade_level_id: parseInt(grade.value as string),
        name: `${
          subjects.find((s) => s.id === parseInt(subject.value as string))?.name
        } - ${
          grades.find((g) => g.id === parseInt(grade.value as string))?.level
        }`,
      },
      model_name: "subject_grade",
    });
  };

  return (
    <Form
      onSubmit={handleSunmit}
      title="Allocate Subject"
      submitButtonText="Allocate Subject"
    >
      <Select
        label="Subject"
        options={subjects}
        value={subject.value}
        onChange={subject.handle_change}
        error={subject.error}
        required
        placeholder="Select a subject"
      />
      <Select
        label="Grade"
        options={grades}
        value={grade.value}
        onChange={grade.handle_change}
        error={grade.error}
        required
        placeholder="Select a grade"
        show_field={"level"}
      />
    </Form>
  );
};

export default SubjectAllocation;
