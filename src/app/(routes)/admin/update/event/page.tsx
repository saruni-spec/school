"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

const Event = () => {
  const [event, setEvent] = useState<record[]>([]);

  const { school_id } = useUser();

  //
  // Fetch the event details
  const fetchSchoolEvents = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/event/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch school facilities`);
      throw new Error(`Failed to fetch school facilities`);
    }
    const data = await response.json();
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) return;
    setEvent(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (!school_id) return;
    fetchSchoolEvents();
  }, [school_id, fetchSchoolEvents]);
  return <DataTable records={event} title="Event" />;
};

export default Event;
