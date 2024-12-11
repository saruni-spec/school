import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";

const SchoolFacility = () => {
  const description = Validation("", []);

  const { school_id } = useUser();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [facility_id, description].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { school_id, facility_id, description },
          model_name: "school_facility",
        }),
      });
    },
    [description, school_id]
  );

  return (
    <Form
      title="School Facility Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <Input
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
