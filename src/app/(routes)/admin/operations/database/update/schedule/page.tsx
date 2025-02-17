"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the school facilities in a school
const UpdateEvent = () => {
  const [events, setEvents] = useState<MyRecord[]>([]);
  const { school_id } = useUser();
  //
  //get the school facilities in a school
  const getEvents = useCallback(async () => {
    const data = await getDataWithSchoolId("event", school_id);

    if (data.length === 0) return;

    setEvents(data);
  }, [school_id]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <EditableTable
      records={events}
      model_name="school_facility"
      school_id={school_id}
      onUpdate={getEvents}
      title="School Facilities"
    />
  );
};

export default UpdateEvent;
