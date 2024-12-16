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
  GraduationCap,
  Newspaper,
  Image,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Screen } from "@/app/components/screen";

const RegisterPage = () => {
  const registerItems = [
    {
      label: "User",
      icon: UserPlus,
      route: "/admin/register/user",
      description: "Register new users with specific roles",
    },
    {
      label: "School",
      icon: School,
      route: "/admin/register/school",
      description: "Add new schools to the system",
    },

    {
      label: "Department",
      icon: Building,
      route: "/admin/register/department",
      description: "Register new departments",
    },

    {
      label: "Academic Year",
      icon: Calendar,
      route: "/admin/register/academic_year",
      description: "Define academic years",
    },
    {
      label: "Class",
      icon: GraduationCap,
      route: "/admin/register/class",
      description: "Create and manage classes",
    },
    {
      label: "Semester",
      icon: Clock,
      route: "/admin/register/semester",
      description: "Set up semester periods",
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
      label: "Role",
      icon: ShieldCheck,
      route: "/admin/register/role",
      description: "Define user roles and permissions",
    },
  ];

  return <Screen items={registerItems} title="Register Options" columns={4} />;
};

export default RegisterPage;
