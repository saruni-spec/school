"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the department staff table
const UpdateDepartmentStaff = () => {
  const [department_staff, setDepartmentStaff] = useState<record[]>([]);

  const { school_id } = useUser();
  //
  //get the department staff
  const getDepartmentStaff = useCallback(async () => {
    const data = await getDataWithSchoolId("department_staff", school_id);

    if (data.length === 0) return;

    setDepartmentStaff(data);
  }, [school_id]);

  useEffect(() => {
    getDepartmentStaff();
  }, [getDepartmentStaff]);

  return (
    <EditableTable
      records={department_staff}
      model_name="department_staff"
      title="Department Staff Table"
      school_id={school_id}
      onUpdate={getDepartmentStaff}
    />
  );
};

export default UpdateDepartmentStaff;
