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

const ViewPage = () => {
  const admin = "/admin";
  const registerItems = [
    {
      label: "Dates",
      icon: Calendar,
      route: `${admin}/view/dates`,
      description: "Manage academic years and semesters",
    },

    {
      label: "Department",
      icon: Building,
      route: `${admin}/view/department`,
      description: "Update current departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: `${admin}/view/user`,
      description: "Update user details",
    },
    {
      label: "Class",
      icon: BookOpenCheck,
      route: `${admin}/view/class`,
      description: "Manage classes and streams",
    },
    {
      label: "Time Table",
      icon: Clock,
      route: `${admin}/view/role`,
      description: "Manage time tables",
    },
    {
      label: "Exam",
      icon: FileSpreadsheet,
      route: `${admin}/view/exam`,
      description: "Update exam details",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: `${admin}/view/subject`,
      description: "Allocate subjects ",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: `${admin}/view/fee`,
      description: "Update fee details",
    },

    {
      label: "Payment",
      icon: Receipt,
      route: `${admin}/view/payment`,
      description: "Update payment details",
    },
    {
      label: "Course Material",
      icon: MapPin,
      route: `${admin}/view/course_material`,
      description: "Manage course materials",
    },
    {
      label: "School Facility",
      icon: Building,
      route: `${admin}/view/school_facility`,
      description: "Manage school facilities",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: `${admin}/view/event`,
      description: "Manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: `${admin}/view/announcement`,
      description: "Manage announcements",
    },
    {
      label: "Award",
      icon: Award,
      route: `${admin}/view/award`,
      description: "Manage awards",
    },
    {
      label: "Files and Photos",
      icon: Image,
      route: `${admin}/view/gallery`,
      description: "Manage photos and files",
    },
  ];

  return (
    <>
      <Screen items={registerItems} title="Register Options" columns={4} />
    </>
  );
};

export default ViewPage;
