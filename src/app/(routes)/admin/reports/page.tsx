"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  attendanceToday,
  studentCount,
  teacherCount,
} from "@/app/actions/actions";
import { useUser } from "@/app/context/user_context";
import { useRouter } from "next/navigation";

const Reports = () => {
  const [total_students, setTotalStudents] = useState<number>();
  const [attendance, setAttendance] = useState<[number]>();
  const [total_teachers, setTotalTeachers] = useState<number>();

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      const students = await studentCount(user?.school?.id);
      setTotalStudents(students);
    };

    const fetchTotalTeachers = async () => {
      const teachers = await teacherCount(user?.school?.id);
      setTotalTeachers(teachers);
    };

    fetchTotalStudents();
    fetchTotalTeachers();
  }, [user]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!total_students) return;

      const attendance_today = await attendanceToday(
        1,
        new Date().toISOString()
      );
      const attendance = (attendance_today * 100) / total_students;
      setAttendance([parseInt(attendance.toFixed(2))]);
    };
    fetchAttendance();
  }, [total_students]);

  const examPerformance = [
    { subject: "Mathematics", avgScore: 78, passRate: 85 },
    { subject: "English", avgScore: 82, passRate: 88 },
    { subject: "Science", avgScore: 75, passRate: 80 },
    { subject: "History", avgScore: 85, passRate: 92 },
    { subject: "Geography", avgScore: 79, passRate: 86 },
  ];

  const disciplineData = [
    { category: "Positive Behavior", count: 145 },
    { category: "Minor Incidents", count: 45 },
    { category: "Major Incidents", count: 12 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          School Performance Dashboard
        </h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="behavior">Student Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {attendance ?? 0}
                </div>
                <p className="text-sm text-gray-500">+2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">3.4</div>
                <p className="text-sm text-gray-500">+0.2 from last semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {total_students ?? 0}
                </div>
                <p className="text-sm text-gray-500">+15 new enrollments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {total_teachers ?? 0}
                </div>
                <p className="text-sm text-gray-500">98% retention rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Subject Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="avgScore"
                      fill="#8884d8"
                      name="Average Score"
                    />
                    <Bar dataKey="passRate" fill="#82ca9d" name="Pass Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "A", value: 30 },
                          { name: "B", value: 35 },
                          { name: "C", value: 20 },
                          { name: "D", value: 10 },
                          { name: "F", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {examPerformance.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Improvement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">96%</div>
                <p className="text-sm text-gray-500">
                  Today&apos;s attendance rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Absences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">42</div>
                <p className="text-sm text-gray-500">Students absent today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">15</div>
                <p className="text-sm text-gray-500">Students late today</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Incidents Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disciplineData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      label
                    >
                      {disciplineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
