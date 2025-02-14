import { Form } from "@/app/components/form";
import React, { useCallback } from "react";
import { MyInput } from "@/app/components/input";
import Validation from "@/app/hooks/validation";

const Teacher = () => {
  const specializations = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!specializations.validate(specializations.value)) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { staff_id, specializations },
          model_name: "teacher",
        }),
      });
    },
    [specializations]
  );
  return (
    <Form
      title="Teacher Registration"
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
    >
      <MyInput
        label="Specializations"
        placeholder="Enter any specializations"
        value={specializations.value}
        onChange={specializations.handle_change}
        error={specializations.error}
      />
    </Form>
  );
};

export default Teacher;
