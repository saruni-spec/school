"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the stream table
const UpdateStream = () => {
  const [stream, setStream] = useState<record[]>([]);

  const { school_id } = useUser();
  //
  //get the stream
  const getStream = useCallback(async () => {
    const data = await getDataWithSchoolId("stream", school_id);

    if (data.length === 0) return;

    setStream(data);
  }, [school_id]);

  useEffect(() => {
    getStream();
  }, [getStream]);

  return (
    <EditableTable
      records={stream}
      model_name="stream"
      title="Stream Table"
      school_id={school_id}
      onUpdate={getStream}
    />
  );
};

export default UpdateStream;
