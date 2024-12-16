"use client";
import React, { useEffect, useCallback, useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import validation, {
  required,
  validateKey,
  validateValue,
} from "@/app/hooks/validation";
import { MultiInput } from "@/app/components/multi_input";
import { useUser } from "@/app/context/user_context";
import CheckboxGroup from "@/app/components/check_box_inputs";
import { grade_levels, gradesInEachLevel, record } from "@/app/types/types";

// School Registration Component
const School: React.FC = () => {
  const name_field = validation("", [required]);
  const address_field = validation("", []);
  const [contact_info, set_contact_info] = useState<Record<string, string>>({});
  const [license_info, set_license_info] = useState<Record<string, string>>({});
  const [school_levels, set_school_levels] = useState<record[]>([]);
  const [selected_levels, set_selected_levels] = useState<record[]>([]);
  const [levels_error, set_levels_error] = useState<string | null>(null);

  //
  //Get the grades in each selected school level
  const getGradesInSelectedSchoolLevel = useCallback(() => {
    let grades: string | number[] = [];
    //
    //loop through the school levels
    // and get the grades in each selected school level
    for (const schoolLevel of selected_levels) {
      //
      //add the grades in each selected school level
      grades = [...grades, ...gradesInEachLevel[schoolLevel.type]];
    }
    return grades;
  }, [selected_levels]);

  useEffect(() => {
    //get the school types from the database
    const getSchoolTypes = async () => {
      const response = await fetch(
        "http://localhost:3000/api/fetch_record?table_name=school_level"
      );
      const data = await response.json();
      set_school_levels(data);
    };
    getSchoolTypes();
  }, []);

  const { setSchool } = useUser();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields before submission
      let is_form_valid = [name_field, address_field].every((field) =>
        field.validate(field.value)
      );
      if (selected_levels.length === 0) {
        set_levels_error("Please select at least one school level");
        is_form_valid = false;
      }
      if (!is_form_valid) return;

      // Send data to server or handle submission
      const school_data = {
        name: name_field.value,
        address: address_field.value,
        contact_info: contact_info,
        license_info: license_info,
      };

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ data: school_data, model_name: "school" }),
      });
      //
      if (response.ok) {
        const data = await response.json();
        setSchool(data);
        //
        //save the school levels
        //loop through the selected levels and save them
        selected_levels.forEach(async (level) => {
          await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: JSON.stringify({
              data: {
                school_id: data.id,
                school_level_id: level.id,
              },
              model_name: "levels_offered",
            }),
          });
        });

        //
        //save a default stream for each grade in the school
        //get all the grades in the school
        const grades = getGradesInSelectedSchoolLevel();
        grades.forEach(async (grade) => {
          //
          //save a default stream for each grade in the school
          await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: JSON.stringify({
              data: {
                school_id: data.id,
                grade_level_id: grade,
                //the name of the stream will be the name of the grade
                //we will use grade to get the key of the grade
                name: Object.keys(grade_levels).find(
                  (key) => grade_levels[key] === grade
                ),
              },
              model_name: "stream",
            }),
          });
        });
        //
        //register a default department for the school
        await fetch("http://localhost:3000/api/register", {
          method: "POST",
          body: JSON.stringify({
            data: {
              school_id: data.id,
              name: "Default Department",
              description: "Default Department",
            },
            model_name: "department",
          }),
        });

        //
        alert("School registered successfully!");
      } else {
        alert("Failed to register school!");
      }
    },
    [
      name_field,
      address_field,
      contact_info,
      license_info,
      setSchool,
      selected_levels,
      getGradesInSelectedSchoolLevel,
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
        label="Address"
        placeholder="Enter the school address"
        value={address_field.value}
        onChange={address_field.handle_change}
        error={address_field.error}
      />
      <CheckboxGroup
        label="Select School Levels offered"
        options={school_levels}
        name="school-levels"
        value={selected_levels}
        onChange={set_selected_levels}
        error={levels_error}
        identifier="type"
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

export default School;
