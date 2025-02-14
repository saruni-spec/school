"use client";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import validation, {
  getEnumSelectOptions,
  required,
} from "@/app/hooks/validation";
import React, { useCallback } from "react";
import { facility_type as my_facilities } from "@prisma/client";
import { Select } from "@/app/components/select";

const Facility = () => {
  //add the validation functions for each input
  const facility_name = validation("", [required]);
  const type = validation("", [required]);
  const options = getEnumSelectOptions(my_facilities);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      //check if the fields are valid
      const is_form_valid = [facility_name, type].every((field) =>
        field.validate(field.value)
      );

      if (!is_form_valid) return;

      //collect the inputs and send them to the server
      await register({
          data: { facility_name: facility_name.value, type: type.value },
          model_name: "facility",
        }),
      });
    },
    [facility_name, type]
  );
  return (
    <Form
      title="Facility Registration"
      onSubmit={handleSubmit}
      submitButtonText="Add Facility"
    >
      <MyInput
        label="facility name"
        placeholder="Enter a new facility"
        value={facility_name.value}
        onChange={facility_name.handle_change}
        error={facility_name.error}
        required
      />
      <Select
        label="facility_type"
        placeholder="Enter what type of facility this is"
        value={type.value}
        onChange={type.handle_change}
        error={type.error}
        options={options}
        required
      />
    </Form>
  );
};

export default Facility;
