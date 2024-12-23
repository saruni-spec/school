"use client";
import React, { useState, useEffect } from "react";
import SearchableList from "./search_bar";
import { record } from "../types/types";

export interface SchoolSelectionProps {
  onSchoolSelect: (school: record) => void;
}

const SchoolSelection: React.FC<SchoolSelectionProps> = ({
  onSchoolSelect,
}) => {
  const [schools, setSchools] = useState<record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/school/name");
        if (!response.ok) {
          throw new Error("Failed to fetch schools");
        }
        const data = await response.json();
        setSchools(data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div>
      {schools.length === 0 ? (
        <p className="text-center text-gray-600">No schools available</p>
      ) : (
        <div className="grid gap-4">
          <SearchableList
            id_field={"id"}
            initialData={schools}
            onItemSelect={onSchoolSelect}
          />
        </div>
      )}
    </div>
  );
};

export default SchoolSelection;
