import Link from "next/link";
import React from "react";
import {
  UserPlus,
  RefreshCw,
  Users,
  GraduationCap,
  Building2,
  CalendarDays,
  Database,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/card";

const Operations = () => {
  const operationGroups = [
    {
      title: "Student Management",
      icon: Users,
      operations: [
        {
          href: "operations/database/register/user",
          icon: UserPlus,
          title: "New Student Registration",
          description: "Enroll new students and create their academic profiles",
        },
        {
          href: "operations/database/update/student_class",
          icon: RefreshCw,
          title: "Review Student Information",
          description: "Modify existing records and academic details",
        },
      ],
    },
    {
      title: "Staff Management",
      icon: GraduationCap,
      operations: [
        {
          href: "operations/database/register/user",
          icon: UserPlus,
          title: "Staff Registration",
          description: "Add new teachers and administrative staff",
        },
        {
          href: "operations/database/update/staff",
          icon: RefreshCw,
          title: "Review Staff Records",
          description: "Modify staff information and assignments",
        },
      ],
    },
    {
      title: "Infrastructure",
      icon: Building2,
      operations: [
        {
          href: "operations/database/register/school_facility",
          icon: UserPlus,
          title: "Add Facilities",
          description: "Register new classrooms, labs, or equipment",
        },
        {
          href: "operations/database/update/school_facility",
          icon: RefreshCw,
          title: "Review Facility Status",
          description: "Modify facility information and maintenance records",
        },
      ],
    },
    {
      title: "Academic Calendar",
      icon: CalendarDays,
      operations: [
        {
          href: "operations/database/register",
          icon: UserPlus,
          title: "Add Events",
          description: "Schedule new academic events and activities",
        },
        {
          href: "operations/database/update/schedule",
          icon: RefreshCw,
          title: "Review Schedule",
          description: "Modify existing events and academic calendar",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            School Operations Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and oversee all aspects of school operations from a central
            dashboard
          </p>
        </div>

        <div className="space-y-8">
          {operationGroups.map((group, index) => (
            <Card key={index} className="border-t-4 border-blue-500">
              <CardHeader className="flex flex-row items-center gap-2">
                <group.icon className="w-6 h-6 text-blue-500" />
                <CardTitle className="text-xl font-bold text-gray-800">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {group.operations.map((operation, opIndex) => (
                    <Link
                      prefetch={false}
                      key={opIndex}
                      href={operation.href}
                      className="block group"
                    >
                      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center mb-3">
                          <operation.icon className="w-5 h-5 text-blue-500 mr-2" />
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                            {operation.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {operation.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Link
            prefetch={false}
            href="/admin/operations/database"
            className="block w-full"
          >
            <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center gap-2 shadow-sm transition-colors duration-200">
              <Database className="w-5 h-5" />
              <span className="font-medium">View All Operations</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Operations;
