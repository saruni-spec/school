"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the award details for the school
const Award = () => {
  const [award, setAward] = useState<record[]>([]);

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

  return (
    <EditableTable
      records={award}
      title="Award Details"
      model_name="award"
      school_id={school_id}
      onUpdate={fetchAwards}
    />
  );
};

export default Award;
