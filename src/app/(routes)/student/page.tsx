"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/card";
import { useStudentDetails, useUser } from "@/app/context/user_context";
import Link from "next/link";

const StudentDashboard = () => {
  const [nextClass, setNextClass] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const { studentDetails } = useStudentDetails();
  const { user, school_id } = useUser();

  useEffect(() => {
    // Fetch next class
    const fetchNextClass = async () => {
      try {
        const response = await fetch(
          `/api/student/slot?school_id=${school_id}&stream_id=${studentDetails?.student_class[0]?.class_progression?.stream_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch schedule");
        const data = await response.json();

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const currentDay = [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ][now.getDay()];

        const todayClass = data.find(
          (slot) =>
            slot.slot.day_of_week === currentDay &&
            slot.slot.start_time > currentTime
        );

        setNextClass(todayClass);
      } catch (error) {
        console.error("Error fetching next class:", error);
      }
    };

    // Fetch assignments
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `/api/student/assignment?class_progression_id=${studentDetails?.student_class[0]?.class_progression?.id}&student_code=${studentDetails?.student_code}`
        );
        if (!response.ok) throw new Error("Failed to fetch assignments");
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    // Fetch attendance
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `/api/student/attendance?users_id=${user?.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch attendance");
        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    if (studentDetails?.id && user?.id) {
      fetchNextClass();
      fetchAssignments();
      fetchAttendance();
    }
  }, [studentDetails, user, school_id]);

  const pendingAssignments = assignments.filter(
    (a) => !a.assignment_attempt?.length
  );
  const completedAssignments = assignments.filter(
    (a) => a.assignment_attempt?.length > 0
  );
  const recentAttendance = attendance[0]?.status || "Not recorded";

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">
          Welcome back, {user.name}! Here&apos;s your overview for today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Assignments
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {pendingAssignments.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Completed Assignments
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {completedAssignments.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Latest Attendance
              </p>
              <h3 className=" font-bold text-gray-800">{recentAttendance}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Class Progress
              </p>
              <h3 className="font-bold text-gray-800">
                {studentDetails?.student_class[0]?.class_progression?.name ||
                  "N/A"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Next Class & Recent Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {nextClass && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Next Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {nextClass.slot?.start_time} - {nextClass.slot?.end_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {nextClass.subject_allocation?.subject_grade?.name}
                    </span>
                    {nextClass.room_number && (
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Room {nextClass.slot?.room_number}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Recent Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAssignments.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-start p-4 bg-white rounded-lg border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {assignment.assignment?.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        Due:{" "}
                        {new Date(
                          assignment.assignment?.due_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingAssignments.length === 0 && (
                  <p className="text-sm text-gray-600">
                    No pending assignments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link
                prefetch={false}
                href="/student/assignments"
                className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Assignments
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/student/attendance"
                className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Attendance
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/student/schedule"
                className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Schedule
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/student/profile"
                className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors"
              >
                <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Profile
                </span>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAssignments.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Completed: {assignment.assignment?.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score:{" "}
                        {assignment.assignment_attempt[0]?.result || "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
