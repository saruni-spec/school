"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

const SchoolFacility = () => {
  const [school_facilities, set_school_facilities] = useState<record[]>([]);
  const { school_id } = useUser();

  //
  //get the school facilities in a school
  const getSchoolFacilities = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/school_facility/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch school facilities`);
      throw new Error(`Failed to fetch school facilities`);
    }
    const data = await response.json();
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) return;
    set_school_facilities(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (!school_id) return;
    getSchoolFacilities();
  }, [getSchoolFacilities, school_id]);

  return <DataTable records={school_facilities} title="School Facilities" />;
};

export default SchoolFacility;
