"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import React, { useCallback } from "react";
import { facility_type as my_facilities } from "@prisma/client";
import { register } from "@/app/api_functions/functions";
import { SelectObject } from "@/app/components/selectobejctitem";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
//
// Facility registration page
const Facility = () => {
  //add the validation functions for each input
  const description = useValidation({ type: FieldType.Text });
  const name = useValidation({ type: FieldType.Text, required: true });
  const type = useValidation({ type: FieldType.Text, required: true });
  const options = my_facilities;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      //
      //check if the fields are valid
      if (!validInputs([description, name, type])) return;

      //collect the inputs and send them to the server
      await register({
        data: {
          name: name.value,
          type: type.value,
          description: description.value,
        },
        model_name: "facility",
      });
    },
    [description, name, type]
  );
  return (
    <Form
      title="Facility Registration"
      onSubmit={handleSubmit}
      submitButtonText="Add Facility"
    >
      <Input
        label="Facility Name"
        placeholder="Enter the name of the facility"
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />

      <SelectObject
        label="facility_type"
        placeholder="Enter what type of facility this is"
        value={type.value}
        onChange={type.handle_change}
        error={type.error}
        options={options}
        required
      />
      <Input
        label="Describe the facility"
        placeholder="This facility is used for..."
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
    </Form>
  );
};

export default Facility;
