"use client";
import { fetchTable } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useEffect, useState } from "react";
//
// Update the school facilities in a school
const UpdateFacility = () => {
  const [facilities, setFacilities] = useState<record[]>([]);
  const { school_id } = useUser();
  //
  //get the school facilities in a school
  const getFacilities = async () => {
    const data = await fetchTable("facility");

    if (data.length === 0) return;

    setFacilities(data);
  };

  useEffect(() => {
    getFacilities();
  }, []);

  return (
    <EditableTable
      records={facilities}
      model_name="school_facility"
      school_id={school_id}
      onUpdate={getFacilities}
      title="School Facilities"
    />
  );
};

export default UpdateFacility;
