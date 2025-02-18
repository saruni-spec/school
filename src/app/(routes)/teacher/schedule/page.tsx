"use client";
import { useTeacherDetails } from "@/app/context/user_context";
import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  Fragment,
} from "react";
import { Card, CardContent } from "@/app/components/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/app/components/loading";
import { TeacherSchedule } from "@/app/api_functions/api_types";

const daysOfWeek = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const days_of_week = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const Schedule = () => {
  const [slots, setSlots] = useState<TeacherSchedule[]>([]);
  const [error, setError] = useState(null);
  const [nextSlot, setNextSlot] = useState<TeacherSchedule | null>(null);
  const { teacherDetails } = useTeacherDetails();

  const updateNextSlot = useCallback((currentSlots: TeacherSchedule[]) => {
    if (currentSlots.length === 0) return;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    // First, look for slots today after current time
    const todaySlots = currentSlots.filter((slot) => {
      return (
        daysOfWeek[currentDay] === slot.slot.day_of_week &&
        slot.slot.start_time > currentTime
      );
    });

    if (todaySlots.length > 0) {
      // Sort by start time and get the earliest slot
      const next = todaySlots.sort((a, b) =>
        a.slot.start_time.localeCompare(b.slot.start_time)
      )[0];
      console.log(next);
      setNextSlot(next);
      return;
    }

    // If no slots found today, look for slots in upcoming days
    let daysToCheck = 7; // Check up to a week ahead
    let checkDay = currentDay;

    while (daysToCheck > 0) {
      checkDay = (checkDay + 1) % 7; // Move to next day, wrap around to Sunday
      const nextDaySlots = currentSlots.filter(
        (slot) => daysOfWeek[checkDay] === slot.slot.day_of_week
      );

      if (nextDaySlots.length > 0) {
        // Sort by start time and get the earliest slot
        const next = nextDaySlots.sort((a, b) =>
          a.slot.start_time.localeCompare(b.slot.start_time)
        )[0];
        console.log(next);
        setNextSlot(next);
        return;
      }

      daysToCheck--;
    }

    // If no slots found in the next week
    setNextSlot(null);
  }, []);

  const fetchSlots = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/teacher/slot?teacher_id=${teacherDetails?.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      const data: TeacherSchedule[] = await response.json();

      setSlots(data);
      updateNextSlot(data);
    } catch (err) {
      setError(err.message);
    }
  }, [teacherDetails, updateNextSlot]);

  useEffect(() => {
    fetchSlots();
    // Update next slot every minute
    const interval = setInterval(() => {
      updateNextSlot(slots);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchSlots]);

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading schedule: {error}
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
                    {nextSlot.slot?.day_of_week}, {nextSlot.slot?.start_time} -{" "}
                    {nextSlot.slot?.end_time}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    {nextSlot.subject_allocation?.subject_grade.name}
                  </span>

                  {nextSlot.slot.room_number && (
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Room {nextSlot.slot?.room_number}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => (
            <Fragment key={day}>
              {days_of_week.includes(day) && (
                <Card key={day} className="overflow-hidden">
                  <div className="bg-blue-500 p-3">
                    <h2 className="text-white font-semibold">{day}</h2>
                  </div>
                  <CardContent className="p-4">
                    {slots.length > 0 ? (
                      <>
                        {slots.map((item) => (
                          <div className="space-y-3" key={item?.slot?.id}>
                            {(
                              item?.slot?.day_of_week as string
                            ).toLowerCase() === day.toLowerCase() && (
                              <div
                                key={item?.slot?.id}
                                className="border rounded p-3 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium">
                                    {item?.slot?.start_time} -{" "}
                                    {item?.slot?.end_time}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-600">
                                  {item?.subject_allocation?.subject_grade.name}
                                </div>

                                {item?.slot?.room_number && (
                                  <div className="text-sm text-gray-500">
                                    Room: {item?.slot?.room_number}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No classes scheduled
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Schedule;
