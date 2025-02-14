import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const FeeType = () => {
  const name = Validation("", [required]);
  const description = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [name].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id: school_id,
            name: name.value,
            description: description.value,
          },
          model_name: "fee_type",
        }),
      });
    },
    [name, description]
  );

  return (
    <Form
      title="Register Fee Type"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <MyInput
        label="Name"
        placeholder="Enter Fee Type Name"
        required
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
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

export default FeeType;
