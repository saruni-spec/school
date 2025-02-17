"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the department staff table
const UpdateDepartmentStaff = () => {
  const [staff, setStaff] = useState<MyRecord[]>([]);

  const { school_id } = useUser();
  //
  //get the department staff
  const getStaff = useCallback(async () => {
    const data = await getDataWithSchoolId("staff", school_id);

    if (data.length === 0) return;

    setStaff(data);
  }, [school_id]);

  useEffect(() => {
    getStaff();
  }, [getStaff]);

  return (
    <EditableTable
      records={staff}
      model_name="department_staff"
      title="Department Staff Table"
      school_id={school_id}
      onUpdate={getStaff}
    />
  );
};

export default UpdateDepartmentStaff;
