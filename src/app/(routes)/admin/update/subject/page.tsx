"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

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

  //get the subject details for a school
  const getSubjectDetails = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/subject/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch subjects`);
      throw new Error(`Failed to fetch subjects`);
    }
    const data = await response.json();
    console.log(data);
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) {
      return;
    }
    set_subjects(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getSubjectDetails();
    }
  }, [school_id, getSubjectDetails]);

  return <DataTable records={subjects} title="Subject Details" />;
};

export default SubjectUpdate;
