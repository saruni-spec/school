"use client";
import { Form } from "@/app/components/form";
import React from "react";
import Validation, { required } from "@/app/hooks/validation";
import { Input } from "@/app/components/input";

import { SelectList } from "@/app/components/select_list";
import { event_scope } from "@prisma/client";
import { useUser } from "@/app/context/user_context";
import { DatePicker, useDateValidation } from "@/app/components/calendar";

const Event = () => {
  const name = Validation("", [required]);
  const description = Validation("", [required]);
  const location = Validation("", [required]);
  const start_date = useDateValidation("", true, new Date());
  const end_date = useDateValidation("", true, new Date());
  const scope = Validation("", [required]);
  const { school_id } = useUser();

  const event_scopes = Object.keys(event_scope);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const is_form_valid = [
      name,
      description,
      location,
      start_date,
      end_date,
      scope,
    ].every((field) => field.validate(field.value));
    if (!is_form_valid) return;

    await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
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
      }),
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
  );
};

export default Event;
