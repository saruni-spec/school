"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/app/context/user_context";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import { MyRecord } from "@/app/types/types";
import EditableTable from "@/app/components/editable_table";
//
//Update department details in a school
const DepartmentUpdate = () => {
  const [departments, set_departments] = useState<MyRecord[]>([]);
  const { school_id } = useUser();
  //
  //fetch all the departments in a school
  const getDepartments = useCallback(async () => {
    const data = await getDataWithSchoolId("department", school_id);

    if (data.length === 0) return;

    set_departments(data);
  }, [school_id]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  //
  return (
    <EditableTable
      records={departments}
      title="Department Details"
      model_name="department"
      school_id={school_id}
      onUpdate={getDepartments}
    />
  );
};

export default DepartmentUpdate;
