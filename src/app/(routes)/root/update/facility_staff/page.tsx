"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the facility staff table
const UpdateFacilityStaff = () => {
  const [facility_staff, setFacilityStaff] = useState<MyRecord[]>([]);

  const { school_id } = useUser();
  //
  //get the facility staff
  const getFacilityStaff = useCallback(async () => {
    const data = await getDataWithSchoolId("facility_staff", school_id);

    if (data.length === 0) return;

    setFacilityStaff(data);
  }, [school_id]);

  useEffect(() => {
    getFacilityStaff();
  }, [getFacilityStaff]);

  return (
    <EditableTable
      records={facility_staff}
      model_name="fee"
      title="Facility Staff Table"
      school_id={school_id}
      onUpdate={getFacilityStaff}
    />
  );
};

export default UpdateFacilityStaff;
