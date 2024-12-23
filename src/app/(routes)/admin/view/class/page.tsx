"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
//This page is used to update the class details for a school
const UpdateClass = () => {
  const [classes, set_classes] = useState<record[]>([]);
  const { school_id } = useUser();
  //
  //get the class details for a school
  const getClassDetails = useCallback(async () => {
    const data = await getDataWithSchoolId("class", school_id);

    if (data.length === 0) return;

    set_classes(data);
  }, [school_id]);

  useEffect(() => {
    getClassDetails();
  }, [getClassDetails]);

  return <DataTable records={classes} title="Class Details" />;
};

export default UpdateClass;
