"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTeacherDetails } from "@/app/context/user_context";
import { Button } from "@/app/components/button";
import { Alert, AlertDescription } from "@/app/components/alert";
import { Check, X } from "lucide-react";
import { attendance_status } from "@prisma/client";
import { AttendanceToday } from "@/app/api_functions/api_types";

type student = {
  id: number;
  student: {
    users: {
      id: number;
      name: string | null;
    } | null;
    student_code: string | null;
  } | null;
};

type AttendanceStatus = {
  [key: number]: string;
};

const Attendance = () => {
  const [students, setStudents] = useState<student[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get the teacher details
  const { teacherDetails } = useTeacherDetails();
  //
  //check if attendance for today has been taken
  const checkAttendance = useCallback(async () => {
    if (!teacherDetails) {
      return;
    }

    const today = new Date();
    try {
      const response = await fetch(
        `/api/attendance/today?date=${today}&class_progression_id=${teacherDetails?.class_progression[0]?.id}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: AttendanceToday[] = await response.json();

      if (data.length > 0) {
        const attendance: AttendanceStatus = {};
        data.forEach((record) => {
          attendance[record.users_id] = record.status;
        });
        setAttendanceData(attendance);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Error fetching attendance. Please try again.");
    }
  }, [teacherDetails]);

  useEffect(() => {
    checkAttendance();
  }, [checkAttendance]);

  //
  //get students in the class
  const getStudentsInClass = useCallback(async () => {
    if (!teacherDetails) {
      return;
    }
    try {
      const response = await fetch(
        `/api/class/students?class_progressionn_id=${teacherDetails?.class_progression[0]?.id}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: student[] = await response.json();
      setStudents(data);

      const initialAttendance = {};
      data.forEach((student) => {
        initialAttendance[student?.student?.users?.id] = null;
      });
      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students. Please try again.");
    }
  }, [teacherDetails]);

  useEffect(() => {
    getStudentsInClass();
  }, [getStudentsInClass]);

  //
  //take attendance
  const takeAttendance = (users_id: number, status: attendance_status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [users_id]: status,
    }));
  };
  //
  //save attendance
  const saveAttendance = async () => {
    try {
      setError("");

      const unmarkedStudents = Object.values(attendanceData).some(
        (status) => status === null
      );
      if (unmarkedStudents) {
        setError("Please mark attendance for all students before saving.");
        return;
      }

      const attendanceRecords = Object.entries(attendanceData).map(
        ([users_id, status]) => ({
          users_id: parseInt(users_id),
          staff_id: teacherDetails?.staff?.id,
          class_progression_id: parseInt(
            teacherDetails?.class_progression[0]?.id
          ),
          status,
          taken_on: new Date(),
        })
      );

      const response = await fetch("/api/attendance/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceRecords),
      });

      if (!response.ok) {
        throw new Error("Failed to save attendance");
      }

      setSuccess("Attendance saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to save attendance. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Class Attendance</h2>

        {error && (
          <Alert variant="error" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <div>
                <p className="font-medium">{student?.student?.users?.name}</p>
                <p className="text-sm text-gray-500">
                  ID: {student?.student?.student_code}
                </p>
              </div>
              <div className="flex gap-2">
                {attendanceData[student.student.users.id] === "PRESENT" && (
                  <></>
                )}
                <Button
                  variant={
                    attendanceData[student.student.users.id] === "PRESENT"
                      ? "success"
                      : "outline-success"
                  }
                  size="sm"
                  onClick={() =>
                    takeAttendance(
                      student?.student?.users?.id as number,
                      "PRESENT"
                    )
                  }
                >
                  <Check className="h-4 w-4 mr-1 inline-block" />
                  Present
                </Button>
                <Button
                  variant={
                    attendanceData[student?.student?.users?.id] === "ABSENT"
                      ? "danger"
                      : "outline-danger"
                  }
                  size="sm"
                  onClick={() =>
                    takeAttendance(
                      student?.student?.users?.id as number,
                      "ABSENT"
                    )
                  }
                >
                  <X className="h-4 w-4 mr-1 inline-block" />
                  Absent
                </Button>
              </div>
            </div>
          ))}
        </div>

        {students.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              onClick={saveAttendance}
              // disabled={loading}
              className="w-full sm:w-auto"
            >
              {/* {loading && (
              <Loader2 className="h-4 w-4 mr-2 inline-block animate-spin" />
            )} */}
              Save Attendance
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
