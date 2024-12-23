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
//
// inports for the table component
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
//
// Review page
const ReviewPage = () => {
  const searchParams = useSearchParams();
  const selectedTable = searchParams.get("table");

  const path_name = "/admin/review";
  const registerItems = [
    {
      label: "Academic Years",
      icon: Calendar,
      route: "academic_year",
      description: "Review academic years",
    },
    {
      label: "Semesters",
      icon: Clock,
      route: "semester",
      description: "Review semesters",
    },

    {
      label: "Departments",
      icon: Building,
      route: "department",
      description: "Review current departments",
    },

    {
      label: "Users",
      icon: UserPlus,
      route: "users",
      description: "Review user details",
    },
    {
      label: "Classes",
      icon: BookOpenCheck,
      route: "class_progression",
      description: "Manage classes and streams",
    },
    {
      label: "Time Tables",
      icon: Clock,
      route: "slot_assignment",
      description: "Manage time tables",
    },
    {
      label: "Exams",
      icon: FileSpreadsheet,
      route: "exam",
      description: "Review exam details",
    },
    {
      label: "Subject Allocation",
      icon: ClipboardCheck,
      route: "subject_allocation",
      description: "Review subjects ",
    },
    {
      label: "Fees",
      icon: CreditCard,
      route: "fee",
      description: "Review fee details",
    },

    {
      label: "Payments",
      icon: Receipt,
      route: "payment",
      description: "Review payment details",
    },
    {
      label: "Course Material",
      icon: MapPin,
      route: "course_material",
      description: "Review course material",
    },
    {
      label: "School Facilities",
      icon: Building,
      route: "school_facility",
      description: "Review school facilities",
    },
    {
      label: "Events",
      icon: Newspaper,
      route: "event",
      description: "Review events",
    },
    {
      label: "Announcements",
      icon: Newspaper,
      route: "announcement",
      description: "Review announcements",
    },
    {
      label: "Awards",
      icon: Award,
      route: "award",
      description: "Review awards",
    },
    {
      label: "Files and Photos",
      icon: Image,
      route: "picture",
      description: "Review photos and files",
    },
  ];

  // Find the selected item to get its label
  const selectedItem = registerItems.find(
    (item) => item.route === selectedTable
  );

  if (selectedTable && selectedItem) {
    return (
      <GenericUpdateTable
        modelName={selectedTable}
        title={`${selectedItem.label} Table`}
      />
    );
  }

  // Otherwise, render the menu screen
  return (
    <Screen
      items={registerItems}
      title="Register Options"
      columns={4}
      path_name={path_name}
    />
  );
};

export default ReviewPage;

interface GenericUpdateTableProps {
  modelName: string;
  title: string;
}

const GenericUpdateTable: React.FC<GenericUpdateTableProps> = ({
  modelName,
  title,
}) => {
  const [records, setRecords] = useState<record[]>([]);
  const { school_id } = useUser();

  const getData = useCallback(async () => {
    const data = await getDataWithSchoolId(modelName, school_id);
    if (data.length === 0) return;
    setRecords(data);
  }, [school_id, modelName]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <EditableTable
      records={records}
      model_name={modelName}
      title={title}
      school_id={school_id}
      onUpdate={getData}
    />
  );
};
