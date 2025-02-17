"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import Validation from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";

const SchoolFacility = () => {
  const description = Validation("", []);

  const { school } = useUser();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [description].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      const school_id = school?.id;
      //
      const facility_id = 1;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { school_id, facility_id, description },
          model_name: "school_facility",
        }),
      });
    },
    [description, school]
  );

  return (
    <Form
      title="School Facility Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <MyInput
        label="Description"
        placeholder="Enter Description (Optional)"
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
    </Form>
  );
};

export default SchoolFacility;
