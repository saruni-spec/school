"use client";
import { fetchData } from "@/app/api_functions/functions";
import { DatePicker } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType, MyRecord } from "@/app/types/types";
import React, { useState, useEffect, useCallback } from "react";
//
// Upadate academic year and semester dates
const DateUpdates = () => {
  const [academic_years, setAcademicYears] = useState<MyRecord[]>([]);
  const [semesters, setSemesters] = useState<Record<number, MyRecord[]>>({});
  const { school_id } = useUser();

  // Validation hooks for academic year dates
  const academic_year_start_date = useValidation({
    type: FieldType.Date,
    required: true,
  });
  const academic_year_end_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: academic_year_start_date.formatted_date as Date | undefined,
  });

  // Fetch academic years
  const getAcademicYears = useCallback(async () => {
    const data = await fetchData("academic_year", school_id, "school_id");

    if (data.length === 0) return;

    setAcademicYears(data);
  }, [school_id]);

  // Fetch semesters grouped by academic year
  const getSemesters = useCallback(async () => {
    if (academic_years.length === 0) return;

    const semestersByYear: Record<number, MyRecord[]> = {};
    for (const academic_year of academic_years) {
      const sem_response = await fetchData(
        "semester",
        academic_year.id,
        "academic_year_id"
      );
      semestersByYear[academic_year.id] = sem_response;
    }
    setSemesters(semestersByYear);
  }, [academic_years]);

  useEffect(() => {
    getAcademicYears();
  }, [getAcademicYears]);

  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  // Handle semester date changes
  const handleSemesterChange = (
    academicYearId: number,
    semesterId: number,
    field: "start_date" | "end_date",
    value: string
  ) => {
    setSemesters((prev) => ({
      ...prev,
      [academicYearId]: prev[academicYearId].map((semester) =>
        semester.id === semesterId ? { ...semester, [field]: value } : semester
      ),
    }));
  };

  return (
    <div className="space-y-12 w-full">
      {academic_years.map((academic_year) => (
        <div
          key={academic_year.id}
          className="min-w-full mx-auto bg-white rounded-lg border border-gray-200 p-6"
        >
          {/* Academic Year Header Row */}
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 min-w-[120px]">
              {academic_year.year as string}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <DatePicker
                label="Start Date"
                value={
                  new Date(academic_year.start_date as Date)
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setAcademicYears((prev) =>
                    prev.map((year) =>
                      year.id === academic_year.id
                        ? { ...year, start_date: e.target.value }
                        : year
                    )
                  )
                }
                error={academic_year_start_date.error}
              />
              <DatePicker
                label="End Date"
                value={
                  new Date(academic_year.end_date as Date)
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setAcademicYears((prev) =>
                    prev.map((year) =>
                      year.id === academic_year.id
                        ? { ...year, end_date: e.target.value }
                        : year
                    )
                  )
                }
                error={academic_year_end_date.error}
              />
            </div>
          </div>

          {/* Semesters Section */}
          <div className="pl-8  flex flex-row justify-between">
            {(semesters[academic_year.id] || []).map((semester) => (
              <div
                key={semester.id}
                className="bg-gray-50 p-4 rounded-lg w-80 h-36"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {semester.name as string}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    label="Start Date"
                    value={
                      new Date(semester.start_date as Date)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      handleSemesterChange(
                        academic_year.id,
                        semester.id,
                        "start_date",
                        e.target.value
                      )
                    }
                  />
                  <DatePicker
                    label="End Date"
                    value={
                      new Date(semester.end_date as Date)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      handleSemesterChange(
                        academic_year.id,
                        semester.id,
                        "end_date",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateUpdates;
