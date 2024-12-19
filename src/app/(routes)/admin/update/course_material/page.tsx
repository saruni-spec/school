"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

const CourseMaterial = () => {
  const [course_materials, set_course_materials] = useState<record[]>([]);
  const { school_id } = useUser();

  //
  //get the course materials in a school
  const getCourseMaterials = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/course_material/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch course materials`);
      throw new Error(`Failed to fetch course materials`);
    }
    const data = await response.json();
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) return;
    set_course_materials(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (!school_id) return;
    getCourseMaterials();
  }, [getCourseMaterials, school_id]);

  return <DataTable records={course_materials} title="Course Materials" />;
};

export default CourseMaterial;
