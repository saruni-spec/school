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
      label: "School",
      icon: School,
      route: "/admin/register/school",
      description: "Add new schools to the system",
    },
    {
      label: "Academic Year",
      icon: Calendar,
      route: "/admin/register/academic_year",
      description: "Define academic years",
    },
    {
      label: "Semester",
      icon: Clock,
      route: "/admin/register/semester",
      description: "Set up semester periods",
    },
    {
      label: "Department",
      icon: Building,
      route: "/admin/register/department",
      description: "Register new departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: "/admin/register/user",
      description: "Register new users with specific roles",
    },
    {
      label: "Stream",
      icon: BookOpenCheck,
      route: "/admin/register/stream",
      description: "Define academic streams",
    },
    {
      label: "Subject",
      icon: FileSpreadsheet,
      route: "/admin/register/subject",
      description: "Register academic subjects",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: "/admin/register/subject_allocation",
      description: "Allocate subjects to grades",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: "/admin/register/fee",
      description: "Manage fee structures",
    },

    {
      label: "Payment",
      icon: Award,
      route: "/admin/register/payment",
      description: "Record and track payments",
    },
    {
      label: "Facility",
      icon: MapPin,
      route: "/admin/register/facility",
      description: "Register school facilities",
    },
    {
      label: "School Facility",
      icon: Building,
      route: "/admin/register/school_facility",
      description: "Map facilities to schools",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: "/admin/register/event",
      description: "Create and manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: "/admin/register/announcement",
      description: "Post system announcements",
    },
    {
      label: "Gallery",
      icon: Image,
      route: "/admin/register/gallery",
      description: "Manage photo galleries",
    },
    {
      label: "Time Table",
      icon: ShieldCheck,
      route: "/admin/register/role",
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
