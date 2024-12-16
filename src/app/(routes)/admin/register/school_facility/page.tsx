"use client";
import React, { useCallback, useState, useEffect } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, { required } from "@/app/hooks/validation";
import { useUser } from "@/app/context/user_context";
import { Select } from "@/app/components/select";
import { record } from "@/app/types/types";

const SchoolFacility = () => {
  const description = Validation("", []);
  const [facilities, setFacilities] = useState<record[]>([]);
  const facility_id = Validation("", [required]);
  const { school_id } = useUser();

  //get the facilities available
  const getFacilities = async () => {
    const response = await fetch(
      `http://localhost:3000/api/fetch_record?table_name=facility`
    );
    const data = await response.json();
    setFacilities(data);
  };

  useEffect(() => {
    getFacilities();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log(facility_id.value);
      const is_form_valid = [facility_id, description].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id,
            facility_id: parseInt(facility_id.value as string),
            description: description.value,
          },
          model_name: "school_facility",
        }),
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
      <Input
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
