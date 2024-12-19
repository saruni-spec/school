"use client";
import React from "react";
import {
  UserPlus,
  School,
  Building,
  Calendar,
  BookOpenCheck,
  FileSpreadsheet,
  CreditCard,
  Clock,
  MapPin,
  Newspaper,
  Image,
  Award,
  ClipboardCheck,
  Receipt,
} from "lucide-react";
import { Screen } from "@/app/components/screen";

const UpdatePage = () => {
  const registerItems = [
    {
      label: "School",
      icon: School,
      route: "/admin/update/school",
      description: "Update school details",
    },
    {
      label: "Dates",
      icon: Calendar,
      route: "/admin/update/dates",
      description: "Manage academic years and semesters",
    },

    {
      label: "Department",
      icon: Building,
      route: "/admin/update/department",
      description: "Update current departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: "/admin/update/user",
      description: "Update user details",
    },
    {
      label: "Class",
      icon: BookOpenCheck,
      route: "/admin/update/class",
      description: "Manage classes and streams",
    },
    {
      label: "Time Table",
      icon: Clock,
      route: "/admin/update/role",
      description: "Manage time tables",
    },
    {
      label: "Exam",
      icon: FileSpreadsheet,
      route: "/admin/update/exam",
      description: "Update exam details",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: "/admin/update/subject",
      description: "Allocate subjects ",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: "/admin/update/fee",
      description: "Update fee details",
    },

    {
      label: "Payment",
      icon: Receipt,
      route: "/admin/update/payment",
      description: "Update payment details",
    },
    {
      label: "Course Material",
      icon: MapPin,
      route: "/admin/update/facility",
      description: "Manage course materials",
    },
    {
      label: "School Facility",
      icon: Building,
      route: "/admin/update/school_facility",
      description: "Manage school facilities",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: "/admin/update/event",
      description: "Manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: "/admin/update/announcement",
      description: "Manage announcements",
    },
    {
      label: "Award",
      icon: Award,
      route: "/admin/update/semester",
      description: "Manage awards",
    },
    {
      label: "Files and Photos",
      icon: Image,
      route: "/admin/update/gallery",
      description: "Manage photos and files",
    },
  ];

  return (
    <>
      <Screen items={registerItems} title="Register Options" columns={4} />
    </>
  );
};

export default UpdatePage;
