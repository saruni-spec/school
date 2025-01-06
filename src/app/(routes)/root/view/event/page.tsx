"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Manage the event details in the school
const Event = () => {
  const [event, setEvent] = useState<MyRecord[]>([]);
  const { school_id } = useUser();
  //
  // Fetch the event details
  const fetchSchoolEvents = useCallback(async () => {
    const data = await getDataWithSchoolId("event", school_id);

    if (data.length === 0) return;

    setEvent(data);
  }, [school_id]);

  useEffect(() => {
    fetchSchoolEvents();
  }, [fetchSchoolEvents]);

  return <DataTable records={event} title="Event" />;
};

export default Event;
