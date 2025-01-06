"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the announcement details for a school
const Announcement = () => {
  const [announcements, set_announcements] = useState<MyRecord[]>([]);
  const { school_id } = useUser();

  //
  //get the announcement details for a school
  const getAnnouncementDetails = useCallback(async () => {
    const data = await getDataWithSchoolId("announcement", school_id);

    if (data.length === 0) return;

    set_announcements(data);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getAnnouncementDetails();
    }
  }, [school_id, getAnnouncementDetails]);

  return (
    <EditableTable
      records={announcements}
      title="Announcement Details"
      model_name="announcement"
      school_id={school_id}
      onUpdate={getAnnouncementDetails}
    />
  );
};

export default Announcement;
