"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the course materials in a school
const CourseMaterial = () => {
  const [course_materials, set_course_materials] = useState<MyRecord[]>([]);
  const { school_id } = useUser();
  //
  //get the course materials in a school
  const getCourseMaterials = useCallback(async () => {
    const data = await getDataWithSchoolId("course_material", school_id);

    if (data.length === 0) return;

    set_course_materials(data);
  }, [school_id]);

  useEffect(() => {
    getCourseMaterials();
  }, [getCourseMaterials]);

  return (
    <EditableTable
      records={course_materials}
      title="Course Material Details"
      model_name="course_material"
      school_id={school_id}
      onUpdate={getCourseMaterials}
    />
  );
};

export default CourseMaterial;
