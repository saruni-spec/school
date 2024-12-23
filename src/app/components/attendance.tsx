import React from "react";
import { Button } from "./button";
import { AlertDescription, Alert } from "./alert";
import { Check, X } from "lucide-react";

const Attendance = ({
  error,
  students,
  attendanceData,
  success,
  saveAttendance,
  takeAttendance,
}: {
  error: string;
  success: string;
  students: [];
  attendanceData: {};
  saveAttendance: () => Promise<void>;
  takeAttendance: (users_id: number, status: attendance_status) => void;
}) => {
  return (
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
              <p className="font-medium">{student.student.users.name}</p>
              <p className="text-sm text-gray-500">
                ID: {student.student.student_code}
              </p>
            </div>
            <div className="flex gap-2">
              {attendanceData[student.student.users.id] === "PRESENT" && <></>}
              <Button
                variant={
                  attendanceData[student.student.users.id] === "PRESENT"
                    ? "success"
                    : "outline-success"
                }
                size="sm"
                onClick={() =>
                  takeAttendance(student.student.users.id, "PRESENT")
                }
              >
                <Check className="h-4 w-4 mr-1 inline-block" />
                Present
              </Button>
              <Button
                variant={
                  attendanceData[student.student.users.id] === "ABSENT"
                    ? "danger"
                    : "outline-danger"
                }
                size="sm"
                onClick={() =>
                  takeAttendance(student.student.users.id, "ABSENT")
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
  );
};

export default Attendance;
