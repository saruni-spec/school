"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Manage the exams for the school
const ExamUpdate = () => {
  const [exams, setExams] = useState<record[]>([
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

  return <DataTable records={exams} title="Exams" />;
};

export default ExamUpdate;
