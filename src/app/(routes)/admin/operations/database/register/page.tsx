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
  ShieldCheck,
  Award,
  ClipboardCheck,
} from "lucide-react";
import { Screen } from "@/app/components/screen";

const RegisterPage = () => {
  const registerItems = [
    {
      label: "Academic Year",
      icon: Calendar,
      route: "/admin/operations/database/register/academic_year",
      description: "Define academic years",
    },
    {
      label: "Semester",
      icon: Clock,
      route: "/admin/operations/database/register/semester",
      description: "Set up semester periods",
    },
    {
      label: "Department",
      icon: Building,
      route: "/admin/operations/database/register/department",
      description: "Register new departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: "/admin/operations/database/register/user",
      description: "Register new users with specific roles",
    },
    {
      label: "Stream",
      icon: BookOpenCheck,
      route: "/admin/operations/database/register/stream",
      description: "Define academic streams",
    },
    {
      label: "Subject",
      icon: FileSpreadsheet,
      route: "/admin/operations/database/register/subject",
      description: "Register academic subjects",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: "/admin/operations/database/register/subject_allocation",
      description: "Allocate subjects to grades",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: "/admin/operations/database/register/fee",
      description: "Manage fee structures",
    },

    {
      label: "Payment",
      icon: Award,
      route: "/admin/operations/database/register/payment",
      description: "Record and track payments",
    },
    {
      label: "Facility",
      icon: MapPin,
      route: "/admin/operations/database/register/facility",
      description: "Register school facilities",
    },
    {
      label: "School Facility",
      icon: Building,
      route: "/admin/operations/database/register/school_facility",
      description: "Map facilities to schools",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: "/admin/operations/database/register/event",
      description: "Create and manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: "/admin/operations/database/register/announcement",
      description: "Post system announcements",
    },
    {
      label: "Gallery",
      icon: Image,
      route: "/admin/operations/database/register/gallery",
      description: "Manage photo galleries",
    },
    {
      label: "Time Table",
      icon: ShieldCheck,
      route: "/admin/operations/database/register/time_table",
      description: "Create and manage time tables",
    },
  ];

  return (
    <>
      <Screen items={registerItems} title="Register Options" columns={4} />
    </>
  );
};

export default RegisterPage;
