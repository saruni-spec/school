"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the attendance table
const UpdateAttendance = () => {
  const [attendance, setAttendance] = useState<record[]>([]);

  const { school_id } = useUser();
  //
  //get the attendance
  const getAttendance = useCallback(async () => {
    const data = await getDataWithSchoolId("attendance", school_id);

    if (data.length === 0) return;

    setAttendance(data);
  }, [school_id]);

  useEffect(() => {
    getAttendance();
  }, [getAttendance]);

  return (
    <EditableTable
      records={attendance}
      model_name="attendance"
      title="Attendance Table"
      school_id={school_id}
      onUpdate={getAttendance}
    />
  );
};

export default UpdateAttendance;
