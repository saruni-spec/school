"use client";
import React, { useCallback } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { Validation } from "@/app/hooks/validation";

// Validators
const required = (value: string) =>
  value.trim() === "" ? "This field is required" : null;

const validateJson = (value: string) => {
  if (value.trim() === "") return null; // Allow empty string
  try {
    JSON.parse(value);
    return null;
  } catch {
    return "Invalid JSON format";
  }
};

// School Registration Component
const SchoolRegistrationForm: React.FC = () => {
  const nameField = Validation("", [required]);
  const typeField = Validation("", [required]);
  const addressField = Validation("", []);
  const contactInfoField = Validation("", [validateJson]);
  const licenseInfoField = Validation("", [validateJson]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields before submission
      const isFormValid = [
        nameField,
        typeField,
        addressField,
        contactInfoField,
        licenseInfoField,
      ].every((field) => field.validate(field.value));

      if (!isFormValid) return;

      // Send data to server or handle submission
      const schoolData = {
        name: nameField.value,
        type: typeField.value,
        address: addressField.value,
        contact_info: contactInfoField.value
          ? JSON.parse(contactInfoField.value)
          : null,
        license_info: licenseInfoField.value
          ? JSON.parse(licenseInfoField.value)
          : null,
      };

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ data: schoolData, modelName: "school" }),
      });
      // Add your submission logic here
    },
    [nameField, typeField, addressField, contactInfoField, licenseInfoField]
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
        value={nameField.value}
        onChange={nameField.handle_change}
        error={nameField.error}
      />
      <Input
        label="School Type"
        placeholder="Enter the school type (e.g., Primary, Secondary)"
        required
        value={typeField.value}
        onChange={typeField.handle_change}
        error={typeField.error}
      />
      <Input
        label="Address"
        placeholder="Enter the school address"
        value={addressField.value}
        onChange={addressField.handle_change}
        error={addressField.error}
      />
      <Input
        label="Contact Info"
        placeholder='Enter contact info as JSON (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={contactInfoField.value}
        onChange={contactInfoField.handle_change}
        error={contactInfoField.error}
      />
      <Input
        label="License Info"
        placeholder='Enter license info as JSON (e.g., {"number": "ABC123", "expiry": "2025-01-01"})'
        value={licenseInfoField.value}
        onChange={licenseInfoField.handle_change}
        error={licenseInfoField.error}
      />
    </Form>
  );
};

export default SchoolRegistrationForm;
