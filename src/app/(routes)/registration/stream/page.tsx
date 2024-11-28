import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";

const Stream = () => {
  const stream_name = Validation("", [required]);
  const capacity = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [stream_name, capacity].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            class_id: class_id,
            stream_name: stream_name.value,
            capacity: capacity.value ? parseInt(capacity.value) : null,
          },
          model_name: "stream",
        }),
      });
    },
    [stream_name, capacity]
  );

  return (
    <Form
      title="Register Stream"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <Input
        label="Stream Name"
        placeholder="Enter Stream Name"
        required
        value={stream_name.value}
        onChange={stream_name.handle_change}
        error={stream_name.error}
      />
      <Input
        label="Capacity"
        placeholder="Enter Capacity (Optional)"
        type="number"
        value={capacity.value}
        onChange={capacity.handle_change}
        error={capacity.error}
      />
    </Form>
  );
};

export default Stream;
