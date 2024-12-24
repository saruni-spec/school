"use client";
import { fetchTable } from "@/app/api_functions/functions";
import { Alert, AlertDescription } from "@/app/components/alert";
import { Button } from "@/app/components/button";
import { Card, CardContent } from "@/app/components/card";
import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
//
// Timetable Creator
// This component is used to create a timetable for a school
//
// Define the types for the timetable creator
interface TimeSlot {
  startTime: string;
  endTime: string;
  type: "lesson" | "break";
}

interface Assignment {
  teacherId: number | null;
  subjectId: number | null;
}

interface SkeletonConfig {
  slotDuration: number;
  startTime: string;
  endTime: string;
  daysPerWeek: number;
  breaks: { startTime: string; duration: number }[];
}

const days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//
//Create the TimetableCreator component
const TimetableCreator = () => {
  // There are two phases in the timetable creation process:
  // 1. Skeleton configuration
  // 2. Assignment of teachers and subjects to slots
  //
  const [currentPhase, setCurrentPhase] = useState<"skeleton" | "assignment">(
    "skeleton"
  );

  // Skeleton configuration state
  // This state is used to configure the structure of the timetable
  const [skeletonConfig, setSkeletonConfig] = useState<SkeletonConfig>({
    slotDuration: 40,
    startTime: "08:00",
    endTime: "16:00",
    daysPerWeek: 5,
    breaks: [],
  });

  // Generated slots state
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Selected class/stream for assignment
  const [selectedStream, setSelectedStream] = useState<number | null>(null);

  // Assignment state
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );

  // Conflict tracking
  // This state is used to track scheduling conflicts
  const [conflicts, setConflicts] = useState<
    { slotId: string; teacherId: number; message: string }[]
  >([]);

  const { school_id } = useUser();

  const [streams, setStreams] = useState<record[]>([]);

  const [subjects, setSubjects] = useState<record[]>([]);

  const [teachers, setTeachers] = useState<record[]>([]);

  //
  // get streams
  const getStreams = useCallback(async () => {
    const response = await fetch(`/api/school/streams?school_id=${school_id}`);
    if (!response.ok) {
      console.error("Failed to fetch streams");
      return;
    }

    const data = await response.json();
    setStreams(data);
  }, [school_id]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  //
  // get subjects
  const getSubjects = async () => {
    const response = await fetchTable("subject_grade");
    setSubjects(response);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  //
  // get teachers
  const getTeachers = useCallback(async () => {
    const response = await fetch(`/api/school/teachers?school_id=${school_id}`);
    if (!response.ok) {
      console.error("Failed to fetch teachers");
      return;
    }

    const data = await response.json();
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );

    setTeachers(flattened_data);
  }, [school_id]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  //
  // Generate time slots based on the skeleton configuration
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    let currentTime = new Date(`2024-01-01 ${skeletonConfig.startTime}`);
    const endTime = new Date(`2024-01-01 ${skeletonConfig.endTime}`);

    while (currentTime < endTime) {
      //
      // Check if a break starts at the current time
      const matchingBreak = skeletonConfig.breaks.find(
        (breakItem) =>
          currentTime.toTimeString().slice(0, 5) === breakItem.startTime
      );
      //
      // If a break is found, add a break slot
      if (matchingBreak) {
        slots.push({
          startTime: matchingBreak.startTime,
          endTime: new Date(
            currentTime.getTime() + matchingBreak.duration * 60000
          )
            .toTimeString()
            .slice(0, 5),
          type: "break",
        });

        currentTime = new Date(
          currentTime.getTime() + matchingBreak.duration * 60000
        );
      } else {
        //
        // Add a lesson slot
        slots.push({
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: new Date(
            currentTime.getTime() + skeletonConfig.slotDuration * 60000
          )
            .toTimeString()
            .slice(0, 5),
          type: "lesson",
        });

        currentTime = new Date(
          currentTime.getTime() + skeletonConfig.slotDuration * 60000
        );
      }
    }

    setTimeSlots(slots);
    setCurrentPhase("assignment");
  };

  //
  //check if a teacher has already been assigned to a slot
  const checkConflicts = (slotId: string, teacherId: number) => {
    return Object.entries(assignments).some(([key, value]) => {
      //
      //get the row and column of the slot from the key
      const [existingSlotId, existingStreamId] = key.split("-");
      //
      // get the row and column of the current slot
      const [row, col] = slotId.split("-");
      //
      //check if the teacher has already been assigned to the slot
      return (
        existingSlotId === row &&
        existingStreamId === col &&
        value.teacherId === teacherId
      );
    });
  };
  //
  //
  const handleAssignment = (
    slotId: string,
    field: "teacherId" | "subjectId",
    value: number
  ) => {
    //
    //Check for conflicts when assigning a teacher to a slot
    if (field === "teacherId" && checkConflicts(slotId, value)) {
      setConflicts((prev) => [
        ...prev,
        {
          slotId,
          teacherId: value,
          message: "Teacher already assigned to this time slot",
        },
      ]);
      return;
    }
    //
    // Assign the teacher to the slot
    const assignmentKey = `${slotId}-${selectedStream}`;
    setAssignments((prev) => ({
      ...prev,
      [assignmentKey]: {
        ...prev[assignmentKey],
        [field]: value,
      },
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {currentPhase === "skeleton" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Configure Timetable Structure</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slot Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={skeletonConfig.slotDuration}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      slotDuration: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={skeletonConfig.startTime}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={skeletonConfig.endTime}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Break Configuration</h3>
              {skeletonConfig.breaks.map((breakItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <Input
                    type="time"
                    value={breakItem.startTime}
                    onChange={(e) =>
                      setSkeletonConfig((prev) => {
                        const updatedBreaks = [...prev.breaks];
                        updatedBreaks[index] = {
                          ...updatedBreaks[index],
                          startTime: e.target.value,
                        };
                        return { ...prev, breaks: updatedBreaks };
                      })
                    }
                  />
                  <Input
                    type="number"
                    value={breakItem.duration}
                    onChange={(e) =>
                      setSkeletonConfig((prev) => {
                        const updatedBreaks = [...prev.breaks];
                        updatedBreaks[index] = {
                          ...updatedBreaks[index],
                          duration: parseInt(e.target.value),
                        };
                        return { ...prev, breaks: updatedBreaks };
                      })
                    }
                    placeholder="Duration (minutes)"
                  />
                  <Button
                    variant="delete"
                    onClick={() =>
                      setSkeletonConfig((prev) => ({
                        ...prev,
                        breaks: prev.breaks.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  setSkeletonConfig((prev) => ({
                    ...prev,
                    breaks: [...prev.breaks, { startTime: "", duration: 0 }],
                  }))
                }
              >
                Add Break
              </Button>
            </div>
            <Button className="mt-4" onClick={generateTimeSlots}>
              Generate Timetable Structure
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Assign Classes</h2>
            <Select
              label="Select Class"
              options={streams}
              value={selectedStream || ""}
              onChange={(e) => setSelectedStream(Number(e.target.value))}
              placeholder="Choose a class"
            />
            {conflicts.length > 0 && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">
                      Teacher scheduling conflicts detected:
                    </div>
                    <ul className="list-disc pl-4 space-y-1">
                      {conflicts.map((conflict, index) => {
                        const timeSlot =
                          timeSlots[parseInt(conflict.slotId.split("-")[0])];
                        const teacherName = teachers?.find(
                          (teacher) => teacher.id === conflict.teacherId
                        )?.["staff.users.name"];
                        const day =
                          days_of_week[parseInt(conflict.slotId.split("-")[1])];

                        return (
                          <li key={index} className="text-sm">
                            <span className="font-semibold">{teacherName}</span>{" "}
                            is already assigned on{" "}
                            <span className="font-semibold">{day}</span> at{" "}
                            <span className="font-semibold">
                              {timeSlot.startTime} - {timeSlot.endTime}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {selectedStream && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2">Time</th>
                      {Array.from({ length: skeletonConfig.daysPerWeek }).map(
                        (_, idx) => (
                          <th key={idx} className="px-4 py-2">
                            {days_of_week[idx]}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, idx) => (
                      <tr
                        key={idx}
                        className={slot.type === "break" ? "bg-gray-50" : ""}
                      >
                        <td className="px-4 py-2 border">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        {Array.from({ length: skeletonConfig.daysPerWeek }).map(
                          (_, dayIdx) => (
                            <td key={dayIdx} className="px-4 py-2 border">
                              {slot.type === "lesson" && (
                                <div className="space-y-2">
                                  <Select
                                    options={subjects}
                                    value={
                                      assignments[
                                        `${idx}-${dayIdx}-${selectedStream}`
                                      ]?.subjectId || ""
                                    }
                                    onChange={(e) =>
                                      handleAssignment(
                                        `${idx}-${dayIdx}`,
                                        "subjectId",
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="Select Subject"
                                  />
                                  <Select
                                    options={teachers}
                                    show_field={"staff.users.name"}
                                    value={
                                      assignments[
                                        `${idx}-${dayIdx}-${selectedStream}`
                                      ]?.teacherId || ""
                                    }
                                    onChange={(e) =>
                                      handleAssignment(
                                        `${idx}-${dayIdx}`,
                                        "teacherId",
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="Select Teacher"
                                  />
                                </div>
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimetableCreator;
