"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

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
    const response = await fetch(
      `http://localhost:3000/api/exam/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch exams`);
      throw new Error(`Failed to fetch exams`);
    }
    const data = await response.json();
    console.log(data);
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) {
      return;
    }
    setExams(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getExams();
    }
  }, [school_id, getExams]);

  return <DataTable records={exams} title="Exams" />;
};

export default ExamUpdate;
