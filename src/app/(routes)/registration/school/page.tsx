"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import validation, { required, validateJson } from "@/app/hooks/validation";

// School Registration Component
const School: React.FC = () => {
  const name_field = validation("", [required]);
  const type_field = validation("", [required]);
  const address_field = validation("", []);
  const contact_info_field = validation("", [validateJson]);
  const license_info_field = validation("", [validateJson]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields before submission
      const is_form_valid = [
        name_field,
        type_field,
        address_field,
        contact_info_field,
        license_info_field,
      ].every((field) => field.validate(field.value));

      if (!is_form_valid) return;

      // Send data to server or handle submission
      const school_data = {
        name: name_field.value,
        type: type_field.value,
        address: address_field.value,
        contact_info: contact_info_field.value
          ? JSON.parse(contact_info_field.value)
          : null,
        license_info: license_info_field.value
          ? JSON.parse(license_info_field.value)
          : null,
      };

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ data: school_data, model_name: "school" }),
      });
      // Add your submission logic here
    },
    [
      name_field,
      type_field,
      address_field,
      contact_info_field,
      license_info_field,
    ]
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
      <Input
        label="Contact Info"
        placeholder='Enter contact info as JSON (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={contact_info_field.value}
        onChange={contact_info_field.handle_change}
        error={contact_info_field.error}
      />
      <Input
        label="License Info"
        placeholder='Enter license info as JSON (e.g., {"number": "ABC123", "expiry": "2025-01-01"})'
        value={license_info_field.value}
        onChange={license_info_field.handle_change}
        error={license_info_field.error}
      />
    </Form>
  );
};

export default School;
