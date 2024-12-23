"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the school facilities in a school
const SchoolFacility = () => {
  const [school_facilities, set_school_facilities] = useState<record[]>([]);
  const { school_id } = useUser();
  //
  //get the school facilities in a school
  const getSchoolFacilities = useCallback(async () => {
    const data = await getDataWithSchoolId("school_facility", school_id);

    if (data.length === 0) return;

    set_school_facilities(data);
  }, [school_id]);

  useEffect(() => {
    getSchoolFacilities();
  }, [getSchoolFacilities]);

  return <DataTable records={school_facilities} title="School Facilities" />;
};

export default SchoolFacility;
