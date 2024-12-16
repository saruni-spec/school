"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import validation, { required } from "@/app/hooks/validation";
import React, { useCallback } from "react";
import { facility_type as my_facilities } from "@prisma/client";

import { SelectObject } from "@/app/components/selectobejctitem";

const Facility = () => {
  //add the validation functions for each input
  const description = validation("", []);
  const name = validation("", [required]);
  const type = validation("", [required]);
  const options = my_facilities;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      //check if the fields are valid
      const is_form_valid = [type, name].every((field) =>
        field.validate(field.value)
      );

      if (!is_form_valid) return;

      //collect the inputs and send them to the server
      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            name: name.value,
            type: type.value,
            description: description.value,
          },
          model_name: "facility",
        }),
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
