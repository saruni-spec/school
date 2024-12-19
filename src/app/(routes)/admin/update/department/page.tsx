"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/app/context/user_context";
import DataTable from "@/app/components/data_table";
import { fetchData } from "@/app/api_functions/functions";
import { record } from "@/app/types/types";

//
//Update department details
const DepartmentUpdate = () => {
  const [departments, set_departments] = useState<record[]>([]);
  const { school_id } = useUser();

  //
  //fetch all the departments in a school
  const getDepartments = useCallback(async () => {
    const response = await fetchData("department", school_id, "school_id");
    set_departments(response);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getDepartments();
    }
  }, [school_id]);

  //
  // Register a department
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
    },
    [school_id]
  );

  return <DataTable records={departments} title="Department Details" />;
};

export default DepartmentUpdate;
