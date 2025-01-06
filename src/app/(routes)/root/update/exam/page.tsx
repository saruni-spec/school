"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Manage the exams for the school
const ExamUpdate = () => {
  const [exams, setExams] = useState<MyRecord[]>([
    {
      id: 987654321,
      name: "No exams found",
      "exam providers": "",
      type: "",
      "start date": "",
      "end date": "",
      "exam sitting": "",
      "semester.name": "",
      "semester.academic year.year": "",
    },
  ]);
  const { school_id } = useUser();
  //
  // get the all the exams for the school
  const getExams = useCallback(async () => {
    const data = await getDataWithSchoolId("exam", school_id);

    if (data.length === 0) return;

    setExams(data);
  }, [school_id]);

  useEffect(() => {
    getExams();
  }, [getExams, school_id]);

  return (
    <EditableTable
      records={exams}
      title="Exams"
      model_name="exam"
      school_id={school_id}
      onUpdate={getExams}
    />
  );
};

export default ExamUpdate;
