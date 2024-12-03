"use client";
import React, { useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import validation, {
  required,
  validateKey,
  validateValue,
} from "@/app/hooks/validation";
import { MultiInput } from "@/app/components/multi_input";

// School Registration Component
const School: React.FC = () => {
  const name_field = validation("", [required]);
  const type_field = validation("", [required]);
  const address_field = validation("", []);
  const [contact_info, set_contact_info] = useState<Record<string, string>>({});
  const [license_info, set_license_info] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields before submission
      const is_form_valid = [name_field, type_field, address_field].every(
        (field) => field.validate(field.value)
      );

      if (!is_form_valid) return;

      // Send data to server or handle submission
      const school_data = {
        name: name_field.value,
        type: type_field.value,
        address: address_field.value,
        contact_info: contact_info,
        license_info: license_info,
      };

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ data: school_data, model_name: "school" }),
      });
      // Add your submission logic here
    },
    [name_field, type_field, address_field, contact_info, license_info]
  );

  return (
    <Form
      title="School Registration"
      description="Register a new school by providing all required details below."
      onSubmit={handleSubmit}
      submitButtonText="Register School"
    >
      {/* Name Field */}
      <Input
        label="School Name"
        placeholder="Enter the school name"
        required
        value={name_field.value}
        onChange={name_field.handle_change}
        error={name_field.error}
      />
      <Input
        label="School Type"
        placeholder="Enter the school type (e.g., Primary, Secondary)"
        required
        value={type_field.value}
        onChange={type_field.handle_change}
        error={type_field.error}
      />
      <Input
        label="Address"
        placeholder="Enter the school address"
        value={address_field.value}
        onChange={address_field.handle_change}
        error={address_field.error}
      />
      <MultiInput
        label="Contact Info"
        placeholder='Enter contact info (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={contact_info}
        onChange={set_contact_info}
        keyPlaceholder="Contact Type (email, phone)"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
      <MultiInput
        label="Contact Info"
        placeholder="Enter License info"
        value={license_info}
        onChange={set_license_info}
        keyPlaceholder="License Type"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
    </Form>
  );
};

export default School;
