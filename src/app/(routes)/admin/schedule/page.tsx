"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Filter,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/dialog";
import {
  getSchedulesItems,
  getUpcomingSchoolEvents,
} from "@/app/actions/actions";
import { installment_types, severity } from "@prisma/client";
import { EventType } from "@/app/api_functions/api_types";

type schedule_item = {
  id: number;
  for: string;
  at_time: Date;
  priority: severity;
  at_place: string;
  notes: string;
  recurr_for: installment_types;
};

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [schedule_items, setScheduleItems] = useState<schedule_item[]>([]);

  // Mock data - replace with actual data from your backend
  const getShedule = async () => {
    const schedule = await getSchedulesItems(1);
    setScheduleItems(schedule);
  };

  useEffect(() => {
    getShedule();
  }, []);

  const getEvents = async () => {
    const events = await getUpcomingSchoolEvents(1);
    setEvents(events);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const getPriorityColor = (priority: severity) => {
    switch (priority) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800";
      case "URGENT":
      case "PRIOTITY":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-KE", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule Dashboard</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={20} />
              Add New
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            {/* Add form will go here */}
            <div className="grid gap-4 py-4">
              {/* Form fields will go here */}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "schedule"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Personal Schedule
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "events"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          School Events
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {activeTab === "schedule"
                ? "Today's Schedule"
                : "Upcoming Events"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTab === "schedule"
                ? schedule_items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.for}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formatDateTime(item.at_time)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {item.at_place}
                        </div>
                        {item.notes && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {event.scope}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(event.start_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Today
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                  This Week
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                  High Priority
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                  School Events
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule_items
                  .filter(
                    (item) =>
                      item.priority === "URGENT" ||
                      item.priority === "EMERGENCY"
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-red-50"
                    >
                      <span className="font-medium text-red-800">
                        {item.for}
                      </span>
                      <span className="text-sm text-red-600">
                        {formatDateTime(item.at_time)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
