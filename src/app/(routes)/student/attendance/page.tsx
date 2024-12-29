"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/app/context/user_context";
import { CalendarDays, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const { user } = useUser();

  const getAttendanceRecords = useCallback(async () => {
    const response = await fetch(
      `/api/student/attendance?users_id=${user?.id}`
    );
    if (!response.ok) {
      console.log("error fetching attendance record for student");
      return;
    }
    const data = await response.json();
    setAttendance(data);
  }, [user]);

  useEffect(() => {
    getAttendanceRecords();
  }, [getAttendanceRecords]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "text-green-600";
      case "absent":
        return "text-red-600";
      case "late":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return <CheckCircle className="w-5 h-5" />;
      case "absent":
        return <AlertCircle className="w-5 h-5" />;
      case "late":
        return <Clock className="w-5 h-5" />;
      default:
        return <CalendarDays className="w-5 h-5" />;
    }
  };

  if (!attendance.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taken By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taken On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Miss On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Up To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.staff?.school_code || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`flex items-center ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {getStatusIcon(record.status)}
                    <span className="ml-2 text-sm font-semibold">
                      {record.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.taken_on)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.to_miss_on ? formatDate(record.to_miss_on) : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.up_to ? formatDate(record.up_to) : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {record.reason_for_absence || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
