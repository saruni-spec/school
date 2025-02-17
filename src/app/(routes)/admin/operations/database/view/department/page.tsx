"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/app/context/user_context";
import DataTable from "@/app/components/data_table";
import { fetchData } from "@/app/api_functions/functions";
import { MyRecord } from "@/app/types/types";
//
//Update department details in a school
const DepartmentUpdate = () => {
  const [departments, set_departments] = useState<MyRecord[]>([]);
  const { school_id } = useUser();
  //
  //fetch all the departments in a school
  const getDepartments = useCallback(async () => {
    const data = await fetchData("department", school_id, "school_id");

    if (data.length === 0) return;

    set_departments(data);
  }, [school_id]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  return <DataTable records={departments} title="Department Details" />;
};

export default DepartmentUpdate;
