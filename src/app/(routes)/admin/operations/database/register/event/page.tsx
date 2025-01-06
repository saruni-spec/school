"use client";
import { Form } from "@/app/components/form";
import React from "react";
import { Input } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import { event_scope } from "@prisma/client";
import { useUser } from "@/app/context/user_context";
import { DatePicker } from "@/app/components/calendar";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { register } from "@/app/api_functions/functions";
//
// Event Registration Page
const Event = () => {
  const name = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text, required: true });
  const location = useValidation({ type: FieldType.Text, required: true });
  const start_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: new Date(),
  });
  const end_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: start_date.formatted_date as Date | undefined,
  });
  const scope = useValidation({ type: FieldType.Text, required: true });
  const { school_id } = useUser();

  const event_scopes = Object.keys(event_scope);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validInputs([name, description, location, start_date, end_date, scope])
    )
      return;

    await register({
      data: {
        name: name.value,
        description: description.value,
        location: location.value,
        start_date: start_date.formatted_date,
        end_date: end_date.formatted_date,
        scope: scope.value,
        school_id: school_id,
      },
      model_name: "event",
    });
  };

  return (
    <Form title="Event" onSubmit={handleSubmit} submitButtonText="Submit">
      <Input
        label="Name"
        placeholder="Enter Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <Input
        label="Description"
        placeholder="Enter Description"
        required
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
      <Input
        label="Location"
        placeholder="Enter Location"
        required
        value={location.value}
        onChange={location.handle_change}
        error={location.error}
      />
      <SelectList
        label="Scope"
        options={event_scopes}
        value={scope.value}
        onChange={scope.handle_change}
        error={scope.error}
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
    </Form>
  );
};

export default Event;
