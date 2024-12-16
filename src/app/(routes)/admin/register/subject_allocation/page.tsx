"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import Validation from "@/app/hooks/validation";
import { record } from "@/app/types/types";
import React, { useEffect, useState } from "react";

const SubjectAllocation = () => {
  const subject = Validation("", []);
  const grade = Validation("", []);

  const [subjects, setSubjects] = useState<record[]>([]);
  const [grades, setGrades] = useState<record[]>([]);

  //get the list of subjects
  const getSubjects = async () => {
    const response = await fetch(
      "http://localhost:3000/api/fetch?table=subject"
    );
    const data = await response.json();
    setSubjects(data);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  //get the list of grades
  const getGrades = async () => {
    const response = await fetch(
      "http://localhost:3000/api/fetch?table=grade_level"
    );
    const data = await response.json();
    setGrades(data);
  };

  useEffect(() => {
    getGrades();
  }, []);

  const handleSunmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const is_form_valid = [subject, grade].every((field) =>
      field.validate(field.value)
    );
    if (!is_form_valid) return;

    //save the subject allocation
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        data: {
          subject_id: parseInt(subject.value as string),
          grade_level_id: parseInt(grade.value as string),
          name: `${
            subjects.find((s) => s.id === parseInt(subject.value as string))
              ?.name
          } - ${
            grades.find((g) => g.id === parseInt(grade.value as string))?.level
          }`,
        },
        model_name: "subject_grade",
      }),
    });

    if (!response.ok) {
      alert("An error occurred");
    }
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
