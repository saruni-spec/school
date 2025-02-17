"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the award details for the school
const Award = () => {
  const [award, setAward] = useState<MyRecord[]>([]);

  const { school_id } = useUser();
  //
  //fetch all awards in  school
  const fetchAwards = useCallback(async () => {
    const data = await getDataWithSchoolId("award", school_id);

    if (data.length === 0) return;

    setAward(data);
  }, [school_id]);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  return <DataTable records={award} title="Awards" />;
};

export default Award;
