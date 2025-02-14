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
  const regsiter_route = "/root/register/";

  const registerItems = [
    {
      label: "School",
      icon: School,
      route: `${regsiter_route}school`,
      description: "Add new schools to the system",
    },
    {
      label: "Academic Year",
      icon: Calendar,
      route: `${regsiter_route}academic_year`,
      description: "Define academic years",
    },
    {
      label: "Semester",
      icon: Clock,
      route: `${regsiter_route}semester`,
      description: "Set up semester periods",
    },
    {
      label: "Department",
      icon: Building,
      route: `${regsiter_route}department`,
      description: "Register new departments",
    },

    {
      label: "User",
      icon: UserPlus,
      route: `${regsiter_route}user`,
      description: "Register new users with specific roles",
    },
    {
      label: "Stream",
      icon: BookOpenCheck,
      route: `${regsiter_route}stream`,
      description: "Define academic streams",
    },
    {
      label: "Subject",
      icon: FileSpreadsheet,
      route: `${regsiter_route}subject`,
      description: "Register academic subjects",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: `${regsiter_route}subject_allocation`,
      description: "Allocate subjects to grades",
    },
    {
      label: "Fee",
      icon: CreditCard,
      route: `${regsiter_route}fee`,
      description: "Manage fee structures",
    },

    {
      label: "Payment",
      icon: Award,
      route: `${regsiter_route}payment`,
      description: "Record and track payments",
    },
    {
      label: "Facility",
      icon: MapPin,
      route: `${regsiter_route}facility`,
      description: "Register school facilities",
    },
    {
      label: "School Facility",
      icon: Building,
      route: `${regsiter_route}school_facility`,
      description: "Map facilities to schools",
    },
    {
      label: "Event",
      icon: Newspaper,
      route: `${regsiter_route}event`,
      description: "Create and manage events",
    },
    {
      label: "Announcement",
      icon: Newspaper,
      route: `${regsiter_route}announcement`,
      description: "Post system announcements",
    },
    {
      label: "Gallery",
      icon: Image,
      route: `${regsiter_route}gallery`,
      description: "Manage photo galleries",
    },
    {
      label: "Time Table",
      icon: ShieldCheck,
      route: `${regsiter_route}time_table`,
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
