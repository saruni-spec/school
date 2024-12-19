"use client";
import React, { useEffect, useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { validateKey, validateValue } from "@/app/hooks/validation";
import { MultiInput } from "@/app/components/multi_input";
import { useUser } from "@/app/context/user_context";
import CheckboxGroup from "@/app/components/check_box_inputs";
import { FieldType, record } from "@/app/types/types";
import { useValidation } from "@/app/hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
import { fetchData, fetchTable } from "@/app/api_functions/functions";

//
// search for a school
// view school details
// allow editing of school details
const SchoolUpdate: React.FC = () => {
  const { school } = useUser();

  // Ensure all hooks are initialized, even when `school` is undefined.
  const [contact_info, set_contact_info] = useState<Record<string, string>>({});
  const [license_info, set_license_info] = useState<Record<string, string>>({});
  const [school_levels, set_school_levels] = useState<record[]>([]);
  const [selected_levels, set_selected_levels] = useState<record[]>([]);
  const [levels_error, set_levels_error] = useState<string | null>(null);

  const name_field = useValidation({
    type: FieldType.Text,
    required: true,
    initialValue: (school?.name as string) || "",
  });
  const address_field = useValidation({
    type: FieldType.Text,
    initialValue: (school?.address as string) || "",
  });
  //
  //Get school details
  useEffect(() => {
    const setDetails = async () => {
      if (school) {
        const data = await fetchData("school", school.id, "id");
        const school_details = data[0];

        set_contact_info(school_details.contact_info as Record<string, string>);
        set_license_info(school_details.license_info as Record<string, string>);
        name_field.handle_value_change(school_details.name as string);
        address_field.handle_value_change(school_details.address as string);
      }
    };
    setDetails();
  }, [school, name_field, address_field]);
  //
  //Get the school levels
  useEffect(() => {
    const getSchoolTypes = async () => {
      const response = await fetchTable("school_level");
      set_school_levels(response);
    };
    getSchoolTypes();
  }, []);
  //
  //get the school levels offered by the school
  useEffect(() => {
    if (school && school_levels.length > 0) {
      const getLevelsOffered = async () => {
        const data = await fetchData("levels_offered", school.id, "school_id");
        const levels_offered = data.map((level) => {
          return school_levels.find(
            (school_level) => school_level.id === level.school_level_id
          );
        });
        set_selected_levels(levels_offered);
        //
        //
      };
      getLevelsOffered();
    }
  }, [school, school_levels]);

  //
  //Get the grades in each selected school level

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validInputs([name_field, address_field])) return;
      if (selected_levels.length === 0) {
        set_levels_error("Please select at least one school level");
        return;
      }

      try {
        // Prepare the school update data
        const schoolData = {
          id: school!.id,
          name: name_field.value,
          address: address_field.value,
          contact_info: contact_info,
          license_info: license_info,
          levels: selected_levels.map((level) => level.id),
        };

        // Send update request
        const response = await fetch("/api/schools/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(schoolData),
        });

        if (!response.ok) {
          throw new Error("Failed to update school");
        }

        // You might want to show a success message or redirect
        // For example:
        alert("School updated successfully");
      } catch (error) {
        console.error("Error updating school:", error);
        // Handle error appropriately
        alert("Failed to update school. Please try again.");
      }
    },
    [
      school,
      name_field,
      address_field,
      contact_info,
      license_info,
      selected_levels,
    ]
  );

  if (!school) {
    return <div>Select a school</div>;
  }

  return (
    <Form
      title="Edit School Details"
      description="Edit the details of the selected school"
      onSubmit={handleSubmit}
      submitButtonText="Update School"
    >
      <Input
        label="School Name"
        placeholder="Enter the school name"
        required
        value={name_field.value}
        onChange={name_field.handle_change}
        error={name_field.error}
      />
      <Input
        label="Address"
        placeholder="Enter the school address"
        value={address_field.value}
        onChange={address_field.handle_change}
        error={address_field.error}
      />
      <CheckboxGroup
        label="Select School Levels offered"
        options={school_levels}
        value={selected_levels}
        onChange={set_selected_levels}
        error={levels_error}
        value_field="type"
        orientation="grid"
        gridColumns={2}
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
        label="License Info"
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

export default SchoolUpdate;
