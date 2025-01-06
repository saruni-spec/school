"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// MAnage the files and images in school galleries
const GalleryFiles = () => {
  const [files, setFiles] = useState<MyRecord[]>([]);

  const { school_id } = useUser();
  //
  //fetch all files in  school
  const fetchFiles = useCallback(async () => {
    const data = await getDataWithSchoolId("gallery", school_id);

    if (data.length === 0) return;

    setFiles(data);
  }, [school_id]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return <DataTable records={files} title="Files" />;
};

export default GalleryFiles;
