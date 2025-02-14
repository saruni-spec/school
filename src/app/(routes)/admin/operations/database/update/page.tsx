"use client";
import React from "react";
import {
  UserPlus,
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
  const route = "operations/database";
  const registerItems = [
    {
      label: "Dates",
      icon: Calendar,
      route: `${route}/update/dates`,
      description: "Manage academic years and semesters",
    },

    {
      label: "Department",
      icon: Building,
      route: `${route}/update/department`,
      description: "Update current departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: `${route}/update/user`,
      description: "Update user details",
    },
    {
      label: "Class",
      icon: BookOpenCheck,
      route: `${route}/update/class`,
      description: "Manage classes and streams",
    },
    {
      label: "Time Table Slots",
      icon: Clock,
      route: `${route}/update/role`,
      description: "Manage time tables",
    },
    {
      label: "Exam",
      icon: FileSpreadsheet,
      route: `${route}/update/exam`,
      description: "Update exam details",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: `${route}/update/subject`,
      description: "Allocate subjects ",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: `${route}/update/fee`,
      description: "Update fee details",
    },

    {
      label: "Payment",
      icon: Receipt,
      route: `${route}/update/payment`,
      description: "Update payment details",
    },
    {
      label: "Course Material",
      icon: MapPin,
      route: `${route}/update/course_material`,
      description: "Manage course materials",
    },
    {
      label: "School Facility",
      icon: Building,
      route: `${route}/update/school_facility`,
      description: "Manage school facilities",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: `${route}/update/event`,
      description: "Manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: `${route}/update/announcement`,
      description: "Manage announcements",
    },
    {
      label: "Award",
      icon: Award,
      route: `${route}/update/award`,
      description: "Manage awards",
    },
    {
      label: "Files and Photos",
      icon: Image,
      route: `${route}/update/gallery`,
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
