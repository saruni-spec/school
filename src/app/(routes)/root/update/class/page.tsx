"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";

const UpdateClass = () => {
  const [classes, set_classes] = useState<MyRecord[]>([]);
  const { school_id } = useUser();

  const getClassDetails = useCallback(async () => {
    const data = await getDataWithSchoolId("class", school_id);
    if (data.length === 0) return;
    set_classes(data);
  }, [school_id]);

  useEffect(() => {
    getClassDetails();
  }, [getClassDetails]);

  return (
    <EditableTable
      records={classes}
      title="Class Details"
      model_name="class_progression"
      school_id={school_id}
      onUpdate={getClassDetails}
    />
  );
};

export default UpdateClass;
