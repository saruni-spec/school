import React from "react";
import {
  Users,
  Phone,
  Calendar,
  Bell,
  Clock,
  Mail,
  UserPlus,
  Clipboard,
  MessageSquare,
  CheckSquare,
  FilePlus,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/card";

import Link from "next/link";

const SecretaryDashboard = () => {
  // In a real application, these would come from your backend
  const visitorCount = 12;
  const pendingMessages = 5;
  const upcomingAppointments = 8;
  const unreadEmails = 15;

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Secretary Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your daily overview.
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
                Today's Visitors
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {visitorCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Messages
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {pendingMessages}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Appointments Today
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {upcomingAppointments}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <CardContent className="flex items-center pt-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread Emails</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {unreadEmails}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Parent-Teacher Meeting
                  </p>
                  <p className="text-xs text-gray-500">9:00 AM - Mr. Johnson</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    New Student Registration
                  </p>
                  <p className="text-xs text-gray-500">
                    11:30 AM - Smith Family
                  </p>
                </div>
              </div>
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
                href="/secretary/visitors"
                className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <UserPlus className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Add Visitor
                </span>
              </Link>
              <Link
                href="/secretary/appointments"
                className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Schedule
                </span>
              </Link>
              <Link
                href="/secretary/messages"
                className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Messages
                </span>
              </Link>
              <Link
                href="/secretary/documents"
                className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors"
              >
                <FilePlus className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  New Doc
                </span>
              </Link>
            </CardContent>
          </Card>

          {/* Important Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                Important Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Principal Office
                    </p>
                    <p className="text-xs text-gray-500">Ext. 101</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Security Office
                    </p>
                    <p className="text-xs text-gray-500">Ext. 102</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-green-500" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">
                  Update visitor log
                </span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">
                  Send weekly report
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                📄 Admission Form - Smith.pdf
              </p>
              <p className="text-sm text-gray-600">
                📄 Staff Meeting Minutes.doc
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-500" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">🔔 Staff meeting @ 2 PM</p>
              <p className="text-sm text-gray-600">
                🔔 Submit attendance report
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
