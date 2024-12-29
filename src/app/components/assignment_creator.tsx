import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import RadioInputs from "@/app/components/radio";
import { FieldType, generic_record, record } from "@/app/types/types";
import React, { useState } from "react";
import QuestionCreator from "@/app/components/assignment_questions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useTeacherDetails } from "@/app/context/user_context";
import { Select } from "@/app/components/select";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";

const assignmentOptions = [{ name: "File" }, { name: "Questions" }];

const CreateAssignment = () => {
  const [assignment, setAssignment] = useState<File | record[]>();
  const [assignmentType, setAssignmentType] = useState<"File" | "Questions">();
  const [selectedRadio, setSelectedRadio] = useState<generic_record>({
    name: "Questions",
  });
  const [selectedSubject, setSelectedSubject] = useState<record>();

  const file = useValidation({ type: FieldType.Text });
  const subject = useValidation({ type: FieldType.Number, required: true });

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
      console.log(assignmentType, assignment);

      if (assignmentType === "File" && assignment instanceof File) {
        // Generate a unique filename using timestamp
        const timestamp = Date.now();
        const fileExtension = assignment.name.split(".").pop();
        const filename = `assignments/${timestamp}.${fileExtension}`;

        // Upload file to Firebase Storage
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, assignment);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Error uploading file:", error);
              reject(error);
            },
            () => {
              resolve(uploadTask.snapshot);
            }
          );
        });

        // Get the file download URL
        const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
        // Create assignment record with file path
        const assignmentData = await register({
          data: {
            description:
              `${selectedSubject?.subject_grade?.name}-${
                file.value
              }/${Date.now()}` ||
              `${
                selectedSubject?.subject_grade?.name
              }-File Assignment/${Date.now()}`,
            file_path: fileUrl,
            teacher_id: teacherDetails?.id,
            subject_allocation_id: parseInt(subject.value as string),
          },
          model_name: "assignment",
        });

        // Create assignment_content record
        await register({
          data: {
            assignment_id: parseInt(assignmentData.id),
            question: assignment.name,
            options: [{ "no options": "no options" }],
          },
          model_name: "assignment_content",
        });
      } else if (assignmentType === "Questions" && Array.isArray(assignment)) {
        // Create assignment record for questions
        const assignmentData = await register({
          data: {
            description: `${
              selectedSubject?.subject_grade?.name
            }-Question Assignment/${Date.now()}`,
            teacher_id: teacherDetails?.id,
            subject_allocation_id: parseInt(subject.value as string),
          },
          model_name: "assignment",
        });

        // Create assignment_content record with questions and options if any
        await Promise.all(
          assignment.map(async (question) => {
            await register({
              data: {
                assignment_id: parseInt(assignmentData.id),
                question: question.text,
                options: question.options
                  ? question.options
                  : [{ "no options": "no options" }],
              },
              model_name: "assignment_content",
            });
          })
        );
      }

      // Handle success (e.g., show success message, redirect, etc.)
      console.log("Assignment created successfully");
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error creating assignment:", error);
    }
  };

  const handleQuestions = (questions: any[]) => {
    setAssignment(questions);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    subject.handle_value_change(e.target.value);
    const selectedSubject = teacherDetails?.subject_allocation?.find(
      (subject) => subject.id === parseInt(e.target.value)
    );

    setSelectedSubject(selectedSubject);
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
        show_field={"subject_grade.name"}
        split_show_field={true}
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

export default CreateAssignment;
