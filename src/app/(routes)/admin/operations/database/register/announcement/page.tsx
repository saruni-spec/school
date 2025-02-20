"use client";
import { Form } from "@/app/components/form";
import React, { Suspense } from "react";
import { MyInput } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import { event_scope } from "@prisma/client";
import { useUser } from "@/app/context/user_context";
import { DatePicker } from "@/app/components/calendar";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";
import { LoadingSpinner } from "@/app/components/loading";
//
// This is the page for registering an announcement
const Announcement = () => {
  const name = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text });
  const start_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: new Date(),
  });
  const end_date = useValidation({ type: FieldType.Text, required: true });
  const scope = useValidation({ type: FieldType.Text, required: true });
  //
  // Get the school id from the user context
  const { school_id } = useUser();
  //
  // Get the event scopes
  const event_scopes = Object.keys(event_scope);
  //
  // Register the announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //
    //validate the inputs
    if (!validInputs([name, description, start_date, end_date, scope])) return;

    await register({
      data: {
        announcement: name.value,
        description: description.value,
        date_for: start_date.formatted_date,
        valid_upto: end_date.formatted_date,
        scope: scope.value,
        school_id: school_id,
      },
      model_name: "event",
    });
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Form title="Event" onSubmit={handleSubmit} submitButtonText="Submit">
        <MyInput
          label="Announcement"
          placeholder="Enter Announcement"
          required
          value={name.value}
          onChange={name.handle_change}
          error={name.error}
        />
        <MyInput
          label="Description"
          placeholder="Enter Description"
          required
          value={description.value}
          onChange={description.handle_change}
          error={description.error}
        />

        <DatePicker
          label="Start Date"
          placeholder="Enter Start Date"
          required
          value={start_date.value}
          onChange={start_date.handle_change}
          error={start_date.error}
        />
        <DatePicker
          label="End Date"
          placeholder="Enter End Date"
          required
          value={end_date.value}
          onChange={end_date.handle_change}
          error={end_date.error}
        />
        <SelectList
          label="Scope"
          options={event_scopes}
          value={scope.value}
          onChange={scope.handle_change}
          error={scope.error}
        />
      </Form>
    </Suspense>
  );
};

export default Announcement;
