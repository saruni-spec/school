"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  BookOpen,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/card";
import { useTeacherDetails } from "@/app/context/user_context";
import Link from "next/link";

const TeacherDashboard = () => {
  const [nextClass, setNextClass] = useState(null);
  const [totalClasses, setTotalClasses] = useState();
  const [assignments, setAssignments] = useState([]);
  const { teacherDetails } = useTeacherDetails();
  const todayAttendance = null;
  useEffect(() => {
    // Fetch next class
    const fetchNextClass = async () => {
      try {
        const response = await fetch(
          `/api/teacher/slot?teacher_id=${teacherDetails?.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch schedule");
        const data = await response.json();

        const todaySlots = data.filter(
          (slot) => slot.slot.day_of_week === new Date().getDay()
        );

        setTotalClasses(todaySlots.length);

        // Find next class logic similar to Schedule component
        const now = new Date();
        const currentTime =
          now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0");

        const todayClass = data.find(
          (slot) => slot.slot.start_time > currentTime
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
          `/api/teacher/get_assignments/${teacherDetails?.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch assignments");
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    if (teacherDetails?.id) {
      fetchNextClass();
      fetchAssignments();
    }
  }, [teacherDetails]);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">
          Welcome back! Here&apos;s your overview for today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {teacherDetails?.class_progression?.[0]?.total_students || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Assignments
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {assignments.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Today&apos;s Attendance
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {todayAttendance || "Not taken"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Today</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalClasses ?? 0}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Next Class & Recent Activities */}
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
                {assignments.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-start p-4 bg-white rounded-lg border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {assignment.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        {assignment.assignment_content?.length || 0} questions
                      </span>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <p className="text-sm text-gray-600">
                    No assignments created yet
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
                href="/teacher/assignments"
                className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Assignments
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/teacher/attendance"
                className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <UserCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Take Attendance
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/teacher/schedule"
                className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Schedule
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/teacher/profile"
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
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                To Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Take attendance for today
                    </p>
                    <p className="text-xs text-gray-500">Due by end of day</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Grade pending assignments
                    </p>
                    <p className="text-xs text-gray-500">
                      3 assignments pending
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
