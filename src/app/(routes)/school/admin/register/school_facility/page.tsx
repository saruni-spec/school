import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const SchoolFacility = () => {
  const description = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [school_id, facility_id, description].every(
        (field) => field.validate(field.value)
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
    [description]
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
