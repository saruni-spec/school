import Link from "next/link";
import React from "react";
import { PlusCircle, Eye, RefreshCw, Search, Database } from "lucide-react";

const CRUD = () => {
  const operations = [
    {
      href: "/admin/operations/database/register",
      title: "Add Data",
      description: "Insert new records into the school database",
      icon: PlusCircle,
    },
    {
      href: "/admin/operations/database/view",
      title: "View Data",
      description: "Browse and search through database records",
      icon: Eye,
    },
    {
      href: "/admin/operations/database/update",
      title: "Update Data",
      description: "Modify existing database records",
      icon: RefreshCw,
    },
    {
      href: "/admin/operations/database/review",
      title: "Review Data",
      description: "Analyze and evaluate database contents",
      icon: Search,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Database Operations
            </h1>
          </div>
          <p className="text-gray-600">
            Manage and interact with the school database system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operations.map((op, index) => (
            <Link key={index} href={op.href} className="block group">
              <div className="h-full p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <op.icon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                    {op.title}
                  </h2>
                </div>
                <p className="text-gray-600">{op.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRUD;
