"use client";
import { useTeacherDetails } from "@/app/context/user_context";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/app/components/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { record } from "@/app/types/types";

const Schedule = () => {
  const [slots, setSlots] = useState<record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextSlot, setNextSlot] = useState<record | null>(null);
  const { teacherDetails } = useTeacherDetails();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const fetchSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/teacher/slot?teacher_id=${teacherDetails?.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      const data = await response.json();
      setSlots(data);
      updateNextSlot(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [teacherDetails]);

  const updateNextSlot = (currentSlots: record[]) => {
    const now = new Date();
    const currentDay = now.getDay() || 7; // Convert Sunday from 0 to 7
    const currentTime = now.getTime();

    // Function to get comparable time for today
    const getTimeForToday = (timeString: string) => {
      const time = new Date(timeString);
      const today = new Date();
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        time.getHours(),
        time.getMinutes()
      ).getTime();
    };

    // Find the next slot
    let next = currentSlots
      .filter((slot) => {
        // If it's today, only include upcoming slots
        if (slot.day_of_week === currentDay) {
          return getTimeForToday(slot.start_time) > currentTime;
        }
        // Include all slots from upcoming days
        return slot.day_of_week > currentDay;
      })
      .sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
          return a.day_of_week - b.day_of_week;
        }
        return (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      })[0];

    // If no upcoming slots this week, look at next week's first slot
    if (!next) {
      next = currentSlots.sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
          return a.day_of_week - b.day_of_week;
        }
        return (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      })[0];
    }

    setNextSlot(next || null);
  };

  useEffect(() => {
    fetchSlots();
    // Update next slot every minute
    const interval = setInterval(() => {
      updateNextSlot(slots);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchSlots]);

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Group slots by day
  const slotsByDay = slots.reduce((acc, slot) => {
    acc[slot.day_of_week] = acc[slot.day_of_week] || [];
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading schedule: {error}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Weekly Schedule
        </h1>
      </div>

      {nextSlot && (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-lg">Next Up</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {daysOfWeek[nextSlot.day_of_week - 1]},{" "}
                  {formatTime(nextSlot.start_time)} -{" "}
                  {formatTime(nextSlot.end_time)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {nextSlot.name && (
                  <span className="text-gray-600">{nextSlot.name}</span>
                )}
                {nextSlot.room_number && (
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Room {nextSlot.room_number}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day, index) => (
          <Card key={day} className="overflow-hidden">
            <div className="bg-blue-500 p-3">
              <h2 className="text-white font-semibold">{day}</h2>
            </div>
            <CardContent className="p-4">
              {slotsByDay[index + 1]?.length > 0 ? (
                <div className="space-y-3">
                  {slotsByDay[index + 1]
                    .sort(
                      (a, b) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                    )
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="border rounded p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            {formatTime(slot.start_time)} -{" "}
                            {formatTime(slot.end_time)}
                          </span>
                        </div>
                        {slot.name && (
                          <div className="text-sm text-gray-600">
                            {slot.name}
                          </div>
                        )}
                        {slot.room_number && (
                          <div className="text-sm text-gray-500">
                            Room: {slot.room_number}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No classes scheduled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
