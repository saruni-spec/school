import React from "react";
import {
  Users,
  GraduationCap,
  Calendar,
  Bell,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  UserCheck,
  AlertCircle,
  Activity,
  CheckCircle,
  Settings,
  User,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/card";

import {
  attendanceToday,
  getNewAnnounceMents,
  getNewMessages,
  getUpcomingSchoolEvents,
  teacherCount,
  studentCount,
} from "@/app/actions/actions";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.school) {
    // Redirect to the login page

    redirect("/login");
  }

  const school_id = session.user.school.id;
  const total_students = await studentCount(school_id);
  const upcoming_events = await getUpcomingSchoolEvents(school_id);
  const total_teachers = await teacherCount(school_id);
  const attendance_today = `${(
    ((await attendanceToday(1, new Date().toISOString())) * 100) /
    total_students
  ).toFixed(2)}%`;

  const new_messages = await getNewMessages(school_id);
  const new_announcements = await getNewAnnounceMents(school_id);

  return (
    <div className="p-8  min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening at your school today.
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
                {total_students}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Teachers
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {total_teachers}
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
                {attendance_today}
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
              <p className="text-sm font-medium text-gray-600">
                Upcoming Events
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {upcoming_events.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {new_messages.length === 0 && new_announcements.length === 0 && (
                <p className="text-sm text-gray-800">No new notifications</p>
              )}
              {new_messages.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start p-4 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    {notification.severity === "PRIOTITY" ||
                      (notification.severity === "URGENT" && (
                        <Bell className="w-5 h-5 text-blue-500" />
                      ))}
                    {notification.severity === "PRIOTITY" ||
                      (notification.severity === "LOW" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ))}
                    {notification.severity === "EMERGENCY" && (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-800">
                      {notification.message_details}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.created_at?.toISOString()}
                    </span>
                  </div>
                </div>
              ))}
              {new_announcements.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start p-4 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    {notification.scope === "DEPARTMENT" && (
                      <Bell className="w-5 h-5 text-blue-500" />
                    )}
                    {notification.scope === "GRADE" ||
                      notification.scope === "STREAM_LEVEL" ||
                      (notification.scope === "class_progression" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ))}
                    {notification.scope === "INTRA_SCHOOL" ||
                      (notification.scope === "INTER_SCHOOL" && (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      ))}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-800">
                      {notification.announcement}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.date_for.toISOString()}-
                      {notification.valid_upto.toISOString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Quick Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link
                prefetch={false}
                href="/admin/reports"
                className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  View Reports
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/admin/operations"
                className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <Settings className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Operations
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/admin/schedule"
                className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Schedule
                </span>
              </Link>
              <Link
                prefetch={false}
                href="/admin/profile"
                className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors"
              >
                <User className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Profile
                </span>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcoming_events.length > 0 &&
                  upcoming_events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.start_date.toISOString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {upcoming_events.length === 0 && (
                  <p className="text-xs text-gray-500">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">85%</div>
            <p className="text-sm text-gray-600">Average pass rate this term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">92%</div>
            <p className="text-sm text-gray-600">Student Retention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-500" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">78%</div>
            <p className="text-sm text-gray-600">Facility usage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
