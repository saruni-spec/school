"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// This page is used to update the subject details for a school
const SubjectUpdate = () => {
  const [subjects, set_subjects] = useState<record[]>([
    {
      id: 7547686758,
      "assigned date": "",
      teacher: "",
      "department.name": "",
      "subject grade.name": "",
      "subject grade.grade level.level": "",
    },
  ]);
  const { school_id } = useUser();
  //
  //get the subject details for a school
  const getSubjectDetails = useCallback(async () => {
    const data = await getDataWithSchoolId("subject", school_id);

    if (data.length === 0) return;

    set_subjects(data);
  }, [school_id]);

  useEffect(() => {
    getSubjectDetails();
  }, [getSubjectDetails]);

  return <DataTable records={subjects} title="Subject Details" />;
};

export default SubjectUpdate;
