"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the student class table
const UpdateStudentClass = () => {
  const [student_class, setStudentClass] = useState<record[]>([]);

  const { school_id } = useUser();
  //
  //get the student class
  const getStudentClass = useCallback(async () => {
    const data = await getDataWithSchoolId("student_class", school_id);

    if (data.length === 0) return;

    setStudentClass(data);
  }, [school_id]);

  useEffect(() => {
    getStudentClass();
  }, [getStudentClass]);

  return (
    <EditableTable
      records={student_class}
      model_name="student_class"
      title="Student Class Table"
      school_id={school_id}
      onUpdate={getStudentClass}
    />
  );
};

export default UpdateStudentClass;
