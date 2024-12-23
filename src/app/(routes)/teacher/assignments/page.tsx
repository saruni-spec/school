"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import RadioInputs from "@/app/components/radio";
import { FieldType, generic_record, record } from "@/app/types/types";
import React, { useState } from "react";
import QuestionCreator from "@/app/components/assignment_questions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useTeacherDetails } from "@/app/context/user_context";
import { Select } from "@/app/components/select";
import { validInputs } from "@/lib/functions";

const assignmentOptions = [{ name: "File" }, { name: "Questions" }];

const Assignments = () => {
  const [assignment, setAssignment] = useState<File | string[]>();
  const [assignmentType, setAssignmentType] = useState<"File" | "Questions">();
  const [selectedRadio, setSelectedRadio] = useState<generic_record>({
    name: "Questions",
  });

  const file = useValidation({ type: FieldType.Text });
  const subject = useValidation({ type: FieldType.Text, required: true });

  const { teacherDetails } = useTeacherDetails();

  const handleFileSubmission = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssignment(e.target.files[0]);
      file.handle_value_change(e.target.files[0].name);
    }
  };

  const handleRadioChange = (record: generic_record) => {
    setSelectedRadio(record);
    setAssignmentType(record["name"] as "File" | "Questions");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validInputs([subject])) return;

      if (!assignment) {
        alert("No assignment content provided");
        throw new Error("No assignment content provided");
      }

      if (assignmentType === "File" && assignment instanceof File) {
        // Generate a unique filename using timestamp
        const timestamp = Date.now();
        const fileExtension = assignment.name.split(".").pop();
        const filename = `assignments/${timestamp}.${fileExtension}`;

        // Upload file to Firebase Storage
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, assignment);
        const fileUrl = await getDownloadURL(storageRef);

        // Create assignment record with file path
        const assignmentResponse = await fetch("/api/assignments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: file.value || "File Assignment", // Using the filename if no description
            file_path: fileUrl,
            teacher_id: teacherDetails?.id,
            subject_allocation_id: subject.value,
          }),
        });

        if (!assignmentResponse.ok) {
          throw new Error("Failed to create assignment");
        }

        const assignmentData = await assignmentResponse.json();

        // Create assignment_content record
        await fetch("/api/assignment-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignment_id: assignmentData.id,
            details: fileUrl,
          }),
        });
      } else if (assignmentType === "Questions" && Array.isArray(assignment)) {
        // Create assignment record for questions
        const assignmentResponse = await fetch("/api/assignments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: "Question Assignment",
            teacher_id: teacherDetails?.id,
            subject_allocation_id: subject.value,
          }),
        });

        if (!assignmentResponse.ok) {
          throw new Error("Failed to create assignment");
        }

        const assignmentData = await assignmentResponse.json();

        // Create assignment_content record with questions
        await fetch("/api/assignment-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignment_id: assignmentData.id,
            details: JSON.stringify(assignment),
            options: assignment.reduce(
              (acc: Record<string, any[]>, question: any) => {
                if (question.type === "multiple" && question.options) {
                  acc[question.id] = question.options;
                }
                return acc;
              },
              {}
            ),
          }),
        });
      }

      // Handle success (e.g., show success message, redirect, etc.)
      console.log("Assignment created successfully");
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error creating assignment:", error);
    }
  };

  const handleQuestions = (questions: any[]) => {
    console.log(questions);
    setAssignment(questions);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    subject.handle_value_change(e.target.value);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title="Create Assignment"
      submitButtonText="Create Assignment"
      orientation="vertical"
    >
      <Select
        options={(teacherDetails?.subject_allocation as record[]) || []}
        label="Subject"
        show_field={"id"}
        value={subject.value}
        onChange={handleSubjectChange}
        error={subject.error}
      />
      <RadioInputs
        label="File or Questions"
        options={assignmentOptions}
        id_field="name"
        name="radio-group"
        value={selectedRadio ? (selectedRadio["name"] as string) : undefined}
        onChange={handleRadioChange}
        value_field="name"
        orientation="horizontal"
      />

      {assignmentType === "File" && (
        <Input
          label="Assignment"
          type="file"
          onChange={handleFileSubmission}
          error={file.error}
        />
      )}

      {assignmentType === "Questions" && (
        <QuestionCreator onSubmit={handleQuestions} />
      )}
    </Form>
  );
};

export default Assignments;
