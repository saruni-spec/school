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

const ViewPage = () => {
  const root = "/root";
  const registerItems = [
    {
      label: "School",
      icon: School,
      route: `${root}/view/school`,
      description: "Update school details",
    },
    {
      label: "Dates",
      icon: Calendar,
      route: `${root}/view/dates`,
      description: "Manage academic years and semesters",
    },

    {
      label: "Department",
      icon: Building,
      route: `${root}/view/department`,
      description: "Update current departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: `${root}/view/user`,
      description: "Update user details",
    },
    {
      label: "Class",
      icon: BookOpenCheck,
      route: `${root}/view/class`,
      description: "Manage classes and streams",
    },
    {
      label: "Time Table",
      icon: Clock,
      route: `${root}/view/role`,
      description: "Manage time tables",
    },
    {
      label: "Exam",
      icon: FileSpreadsheet,
      route: `${root}/view/exam`,
      description: "Update exam details",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: `${root}/view/subject`,
      description: "Allocate subjects ",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: `${root}/view/fee`,
      description: "Update fee details",
    },

    {
      label: "Payment",
      icon: Receipt,
      route: `${root}/view/payment`,
      description: "Update payment details",
    },
    {
      label: "Course Material",
      icon: MapPin,
      route: `${root}/view/course_material`,
      description: "Manage course materials",
    },
    {
      label: "School Facility",
      icon: Building,
      route: `${root}/view/school_facility`,
      description: "Manage school facilities",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: `${root}/view/event`,
      description: "Manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: `${root}/view/announcement`,
      description: "Manage announcements",
    },
    {
      label: "Award",
      icon: Award,
      route: `${root}/view/award`,
      description: "Manage awards",
    },
    {
      label: "Files and Photos",
      icon: Image,
      route: `${root}/view/gallery`,
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
