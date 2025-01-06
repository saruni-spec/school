"use client";
import React, { useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { DatePicker } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { SelectList } from "@/app/components/select_list";
import { getStreams } from "@/app/actions/actions";
import CheckBoxToggle from "@/app/components/checkbox_toggle";
import { validInputs } from "@/lib/functions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { register } from "@/app/api_functions/functions";
import { FailureFeedback, SuccessFeedback } from "@/app/components/feedback";
//
//Register ans academic year for a school
const AcademicYear = () => {
  // State for managing feedback
  const [feedbackType, setFeedbackType] = useState<
    "success" | "failure" | null
  >(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const name = useValidation({ type: FieldType.Text, required: true });
  const start_date = useValidation({
    type: FieldType.Date,
    required: true,
  });
  const end_date = useValidation({ type: FieldType.Date, required: true });
  const is_current = useValidation({
    type: FieldType.Text,
    initialValue: "off",
    required: true,
  });
  //
  //get the school id from the context
  const { school_id } = useUser();
  //
  //handle the change of the start date
  const handleStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    start_date.handle_change(e);
    //
    //get the year from the start date
    const year = new Date(e.target.value).getFullYear();
    //
    //set the year to the academic year name
    name.set_value(year.toString());
    //
    //check if the year is the current year
    checkCurrentYear(e as React.ChangeEvent<HTMLSelectElement>);
  };
  //
  //Update the year name and checkbox when the nae(year) is selected
  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    name.handle_change(e);
    checkCurrentYear(e);
  };
  //
  //check if the year selected is the current year
  const checkCurrentYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current =
      new Date().getFullYear() === parseInt(e.target.value as string);

    if (current) {
      is_current.set_value("on");
      return;
    }

    is_current.set_value("off");
  };
  //
  // Submit the details to register the academic year
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Reset previous feedback
      setFeedbackType(null);
      setFeedbackMessage("");

      // Validate the inputs
      if (!validInputs([name, start_date, end_date])) {
        setFeedbackType("failure");
        setFeedbackMessage("Please check and correct the form inputs.");
        return;
      }

      try {
        const academic_year_data = {
          school_id: school_id,
          year: name.value,
          start_date: start_date.formatted_date,
          end_date: end_date.formatted_date,
          is_current: is_current.value === "on",
        };
        const model_name = "academic_year";

        // Register the academic year
        const academic_year = await register({
          data: academic_year_data,
          model_name,
        });

        // Get the streams in that school
        const streams = await getStreams(school_id);

        // Create a class progression in each of the streams
        await Promise.all(
          streams.map(async (stream) => {
            await register({
              data: {
                stream_id: stream.id,
                academic_year_id: academic_year.id,
                is_current: is_current.value === "on",
                name: `${stream.name}/${name.value}`,
              },
              model_name: "class_progression",
            });
          })
        );

        // Set success feedback
        setFeedbackType("success");
        setFeedbackMessage(
          `Academic Year ${name.value} successfully registered!`
        );
      } catch (error) {
        // Set failure feedback
        setFeedbackType("failure");
        setFeedbackMessage(
          error instanceof Error
            ? error.message
            : "Failed to register academic year. Please try again."
        );
      }
    },
    [name, start_date, end_date, school_id, is_current]
  );

  // Reset form after successful registration
  const handleResetForm = () => {
    name.set_value("");
    start_date.set_value("");
    end_date.set_value("");
    is_current.set_value("off");
    setFeedbackType(null);
  };

  // Render feedback if exists
  if (feedbackType === "success") {
    return (
      <SuccessFeedback
        input_message={feedbackMessage}
        action={{
          label: "Go to Dashboard",
          onClick: handleResetForm,
        }}
      />
    );
  }

  if (feedbackType === "failure") {
    return (
      <FailureFeedback
        input_message={feedbackMessage}
        action={{
          label: "Try Again",
          onClick() {
            setFeedbackType(null);
          },
        }}
      />
    );
  }

  return (
    <Form
      title="Academic Year Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <DatePicker
        label="Start Date"
        value={start_date.value}
        onChange={handleStartDateChange}
        error={start_date.error}
        required
      />
      <DatePicker
        label="End Date"
        value={end_date.value}
        onChange={end_date.handle_change}
        error={end_date.error}
        required
      />
      <SelectList
        label="Academic Year"
        placeholder="Enter Academic Year eg 2025..."
        options={["2020", "2021", "2022", "2023", "2024", "2025"]}
        required
        value={name.value}
        onChange={handleYearSelect}
        error={name.error}
      />
      <CheckBoxToggle
        label="Select if this is the current academic year or the one about to start"
        error={is_current.error}
        onChange={is_current.handle_change}
        value={(is_current.value as "on") || "off"}
      />
    </Form>
  );
};

export default AcademicYear;
