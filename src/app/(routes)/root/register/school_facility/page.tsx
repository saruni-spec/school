"use client";
import React, { useCallback, useState, useEffect } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { useUser } from "@/app/context/user_context";
import { Select } from "@/app/components/select";
import { FieldType, MyRecord } from "@/app/types/types";
import { fetchTable, register } from "@/app/api_functions/functions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
//
// School Facility Registration Component
const SchoolFacility = () => {
  const description = useValidation({ type: FieldType.Text });
  const facility_id = useValidation({ type: FieldType.Text, required: true });

  const { school_id } = useUser();

  const [facilities, setFacilities] = useState<MyRecord[]>([]);
  //
  //get the facilities available
  const getFacilities = async () => {
    const response = await fetchTable("facility");
    setFacilities(response);
  };

  useEffect(() => {
    getFacilities();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validInputs([facility_id, description])) return;

      await register({
        data: {
          school_id: school_id,
          facility_id: parseInt(facility_id.value as string),
          description: description.value,
        },
        model_name: "school_facility",
      });
    },
    [description, school_id, facility_id]
  );

  return (
    <Form
      title="School Facility Registration"
      onSubmit={handleSubmit}
      submitButtonText="Register"
    >
      <Select
        label="Facility"
        options={facilities}
        value={facility_id.value}
        onChange={facility_id.handle_change}
        error={facility_id.error}
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

export default SchoolFacility;
