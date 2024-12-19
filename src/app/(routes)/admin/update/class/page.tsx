"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

const UpdateClass = () => {
  //
  const [classes, set_classes] = useState<record[]>([]);
  const { school_id } = useUser();
  //
  //get the class details for a school
  const getClassDetails = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/class/details?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch classes`);
      throw new Error(`Failed to fetch classes`);
    }
    const data = await response.json();
    console.log(data);
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    console.log(flattened_data);
    set_classes(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getClassDetails();
    }
  }, [school_id, getClassDetails]);

  return <DataTable records={classes} title="Class Details" />;
};

export default UpdateClass;
