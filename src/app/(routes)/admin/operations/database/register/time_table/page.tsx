"use client";
import {
  fetchTable,
  getDataFromApi,
  register,
} from "@/app/api_functions/functions";
import { Alert, AlertDescription } from "@/app/components/alert";
import { Button } from "@/app/components/button";
import { Card, CardContent } from "@/app/components/card";
import { MyInput } from "@/app/components/input";
import { Select } from "@/app/components/select";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
//
// Timetable Creator
// This component is used to create a timetable for a school

interface TimeSlot {
  start_time: string;
  end_time: string;
  type: "lesson" | "break";
}

interface Assignment {
  teacher_id: number | null;
  subject_id: number | null;
}

interface SkeletonConfig {
  id?: number;
  slot_duration: number;
  start_time: string;
  end_time: string;
  days_per_week: number;
  breaks: { startTime: string; duration: number }[];
  school_id?: number;
  semester_id?: number;
}

interface TempSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  assignments: TempSlotAssignment[];
}

interface TempSlotAssignment {
  subject_allocation: SubjectAllocation;
}

type SubjectAllocation = {
  stream_id: number;
  teacher_id: number;
  subject_id: number;
};

type SaveItem = {
  start_time: string;
  end_time: string;
  day_of_week: string;
  room_number: string | undefined;
  time_table_id?: number;
  slot_assignment: {
    stream_id: number;
    teacher_id: number;
    semester_id: number;
    subject_grade_id: number;
  }[];
};

const days_of_week = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
//
//Create the TimetableCreator component
const TimetableCreator = () => {
  const { school_id } = useUser();

  const [current_semester, setCurrentSemester] = useState<number>();
  // There are two phases in the timetable creation process:
  // 1. Skeleton configuration
  // 2. Assignment of teachers and subjects to slots
  //
  const [current_phase, setCurrentPhase] = useState<"skeleton" | "assignment">(
    "skeleton"
  );

  // Skeleton configuration state
  // This state is used to configure the structure of the timetable
  const [skeleton_config, setSkeletonConfig] = useState<SkeletonConfig>({
    slot_duration: 40,
    start_time: "08:00",
    end_time: "16:00",
    days_per_week: 5,
    breaks: [],
    school_id: school_id,
    semester_id: current_semester,
  });

  // Generated slots state
  const [time_slots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Selected class/stream for assignment
  const [selected_stream, setSelectedStream] = useState<number | null>(null);

  // Assignment state
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );
  //
  //staes for temporary storage
  const [temp_slots, setTempSlots] = useState<TempSlot[]>([]);
  const [is_saving, setIsSaving] = useState(false);
  const [has_saved_changes, setHasUnsavedChanges] = useState(false);
  const [saved_changes, setSavedChanges] = useState<SaveItem[]>([]);

  // Conflict tracking
  // This state is used to track scheduling conflicts
  const [conflicts, setConflicts] = useState<
    { slotId: string; teacher_id: number; message: string }[]
  >([]);

  const [streams, setStreams] = useState<MyRecord[]>([]);

  const [subjects, setSubjects] = useState<MyRecord[]>([]);

  const [teachers, setTeachers] = useState<MyRecord[]>([]);

  // Helper function to convert day of week string to number
  const dayOfWeekToNumber = (day: string): number => {
    return days_of_week.indexOf(day);
  };
  // Function to format slots
  const formatDBSlotsToTempSlots = useCallback((dbSlots: any): TempSlot[] => {
    return dbSlots.map((slot) => {
      // Format assignments
      const assignments: TempSlotAssignment[] = slot.slot_assignment.map(
        (assignment) => ({
          subject_allocation: {
            stream_id: assignment.stream_id,
            teacher_id: assignment.subject_allocation.teacher_id || 0, // Provide default value if null
            subject_id: assignment.subject_allocation.subject_grade_id || 0, // Provide default value if null
          },
        })
      );

      // Create formatted slot
      const tempSlot: TempSlot = {
        day_of_week: dayOfWeekToNumber(slot.day_of_week),
        start_time: slot.start_time,
        end_time: slot.end_time,
        assignments,
      };

      // Add room_number if it exists
      if (slot.room_number) {
        tempSlot.room_number = slot.room_number;
      }

      return tempSlot;
    });
  }, []);

  //get slots saved in db
  const getSlotsInDb = useCallback(async () => {
    const data = await getDataFromApi(
      `/api/time_table/get_slots?school_id=${school_id}&semester_id=${current_semester}`
    );

    if (!data || data.length === 0) return;

    const formatted_slots = formatDBSlotsToTempSlots(data.slots);

    const skeleton = {
      id: data.id,
      slot_duration: data.slot_duration,
      start_time: data.start_time,
      end_time: data.end_time,
      days_per_week: data.days_per_week,
      breaks: data.breaks,
      school_id: data.school_id,
      semester_id: data.semester_id,
    };

    setSkeletonConfig(skeleton);
    // Create a new assignments object based on the formatted slots
    const new_assignments: Record<string, Assignment> = {};

    formatted_slots.forEach((slot) => {
      // Convert the time to slot index
      const slot_index = time_slots.findIndex(
        (timeSlot) =>
          timeSlot.start_time === slot.start_time &&
          timeSlot.end_time === slot.end_time
      );

      if (slot_index !== -1) {
        slot.assignments.forEach((assignment) => {
          const key = `${slot_index}-${slot.day_of_week}-${assignment.subject_allocation.stream_id}`;
          new_assignments[key] = {
            teacher_id: assignment.subject_allocation.teacher_id,
            subject_id: assignment.subject_allocation.subject_id,
          };
        });
      }
    });

    // Update the assignments state
    setAssignments(new_assignments);

    // Also update temp_slots for consistency
    setTempSlots(formatted_slots);
  }, [school_id, current_semester, formatDBSlotsToTempSlots, time_slots]);

  useEffect(() => {
    getSlotsInDb();
  }, [getSlotsInDb]);

  const getCurrentSemester = useCallback(async () => {
    const data = await getDataFromApi(
      `/api/semester/current?school_id=${school_id}`
    );

    if (!data || data.length === 0) return;

    setCurrentSemester(data.id);
  }, [school_id]);

  useEffect(() => {
    getCurrentSemester();
  }, [getCurrentSemester]);

  const getStreams = useCallback(async () => {
    const data = await getDataFromApi(
      `/api/school/streams?school_id=${school_id}`
    );

    if (!data || data.length === 0) return;

    setStreams(data);
  }, [school_id]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  const getSubjects = async () => {
    const data = await fetchTable("subject_grade");

    if (!data || data.length === 0) return;

    setSubjects(data);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  const getTeachers = useCallback(async () => {
    const data = await getDataFromApi(
      `/api/school/teachers?school_id=${school_id}`
    );

    if (!data || data.length === 0) return;

    const flattened_data = data.map((item: MyRecord) =>
      flattenObjectIterative(item)
    );

    setTeachers(flattened_data);
  }, [school_id]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  //
  // Generate time slots based on the skeleton configuration
  const generateTimeSlots = async () => {
    let time_table = skeleton_config;

    if (!time_table.id) {
      time_table = await register({
        model_name: "time_table",
        data: {
          ...time_table,
          name: `TT-${school_id}/${current_semester}/${new Date().getFullYear()}`,
        },
      });
    }
    time_table.school_id = school_id;
    time_table.semester_id = current_semester;
    setSkeletonConfig(time_table);

    const slots: TimeSlot[] = [];
    let currentTime = new Date(`2024-01-01 ${time_table.start_time}`);
    const endTime = new Date(`2024-01-01 ${time_table.end_time}`);

    while (currentTime < endTime) {
      //
      // Check if a break starts at the current time
      const matchingBreak = time_table.breaks.find(
        (breakItem) =>
          currentTime.toTimeString().slice(0, 5) === breakItem.startTime
      );

      if (matchingBreak) {
        slots.push({
          start_time: matchingBreak.startTime,
          end_time: new Date(
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
        slots.push({
          start_time: currentTime.toTimeString().slice(0, 5),
          end_time: new Date(
            currentTime.getTime() + time_table.slot_duration * 60000
          )
            .toTimeString()
            .slice(0, 5),
          type: "lesson",
        });

        currentTime = new Date(
          currentTime.getTime() + time_table.slot_duration * 60000
        );
      }
    }

    setTimeSlots(slots);
    setCurrentPhase("assignment");
  };

  //
  //check if a teacher has already been assigned to a slot
  const checkConflicts = (slot_id: string, teacher_id: number) => {
    return Object.entries(assignments).some(([key, value]) => {
      //
      //get the row and column of the slot from the key
      const [existing_slot_id, existing_stream_id] = key.split("-");
      //
      // get the row and column of the current slot
      const [row, col] = slot_id.split("-");
      //
      //check if the teacher has already been assigned to the slot
      return (
        existing_slot_id === row &&
        existing_stream_id === col &&
        value.teacher_id === teacher_id
      );
    });
  };
  //
  // Update temporary storage as assignments are made
  const updateTempStorage = (
    day_index: number,
    time_slot: TimeSlot,
    stream_id: number,
    teacher_id: number,
    subject_id: number
  ) => {
    setTempSlots((prev) => {
      const slot_index = prev.findIndex(
        (slot) =>
          slot.day_of_week === day_index &&
          slot.start_time === time_slot.start_time &&
          slot.end_time === time_slot.end_time
      );

      if (slot_index === -1) {
        // Create new slot with assignment
        return [
          ...prev,
          {
            day_of_week: day_index,
            start_time: time_slot.start_time,
            end_time: time_slot.end_time,
            assignments: [
              {
                subject_allocation: {
                  stream_id: stream_id,
                  teacher_id: teacher_id,
                  subject_id: subject_id,
                },
              },
            ],
          },
        ];
      }

      // Update existing slot's assignments
      const updated_slots = [...prev];
      const existing_assignment_index = updated_slots[
        slot_index
      ].assignments.findIndex(
        (a) => a.subject_allocation.stream_id === stream_id
      );

      if (existing_assignment_index === -1) {
        updated_slots[slot_index].assignments.push({
          subject_allocation: {
            stream_id: stream_id,
            teacher_id: teacher_id,
            subject_id: subject_id,
          },
        });
      } else {
        updated_slots[slot_index].assignments[existing_assignment_index] = {
          subject_allocation: {
            stream_id: stream_id,
            teacher_id: teacher_id,
            subject_id: subject_id,
          },
        };
      }

      return updated_slots;
    });

    setHasUnsavedChanges(true);
  };

  //
  //
  const handleAssignment = (
    slot_id: string,
    field: "teacher_id" | "subject_id",
    value: number
  ) => {
    //
    //Check for conflicts when assigning a teacher to a slot
    if (field === "teacher_id" && checkConflicts(slot_id, value)) {
      setConflicts((prev) => [
        ...prev,
        {
          slotId: slot_id,
          teacher_id: value,
          message: "Teacher already assigned to this time slot",
        },
      ]);
      return;
    }
    //
    //use temp storage to store assignments
    const [time_slot_index, day_index] = slot_id.split("-").map(Number);
    const time_slot = time_slots[time_slot_index];
    //
    // Assign the teacher to the slot
    const assignment_key = `${slot_id}-${selected_stream}`;
    setAssignments((prev) => ({
      ...prev,
      [assignment_key]: {
        ...prev[assignment_key],
        [field]: value,
      },
    }));

    // If both teacher and subject are assigned, update temp storage
    const current_assignment = assignments[assignment_key] || {};
    if (
      (field === "teacher_id" && current_assignment.subject_id) ||
      (field === "subject_id" && current_assignment.teacher_id)
    ) {
      updateTempStorage(
        day_index,
        time_slot,
        selected_stream!,
        field === "teacher_id" ? value : current_assignment.teacher_id!,
        field === "subject_id" ? value : current_assignment.subject_id!
      );
    }
  };

  // Function to compare two slot objects deeply
  const areSlotsEqual = (slot1: SaveItem, slot2: SaveItem) => {
    return (
      slot1.start_time === slot2.start_time &&
      slot1.end_time === slot2.end_time &&
      slot1.day_of_week === slot2.day_of_week &&
      slot1.room_number === slot2.room_number &&
      JSON.stringify(slot1.slot_assignment) ===
        JSON.stringify(slot2.slot_assignment)
    );
  };

  // Function to save to database
  const saveTimetable = async () => {
    try {
      setIsSaving(true);

      // Create slots and store their IDs
      const slot_responses = temp_slots.map((slot) => ({
        start_time: slot.start_time,
        end_time: slot.end_time,
        day_of_week: days_of_week[slot.day_of_week],
        room_number: slot.room_number,
        time_table_id: skeleton_config.id,
        slot_assignment: slot.assignments.map((assignment) => ({
          stream_id: assignment.subject_allocation.stream_id,
          teacher_id: assignment.subject_allocation.teacher_id,
          semester_id: current_semester!,
          subject_grade_id: assignment.subject_allocation.subject_id,
        })),
      }));

      //
      //get those not in saved changes
      // Filter items in slotResponses that are not in savedItems
      const new_items = slot_responses.filter(
        (slot) =>
          !saved_changes.some((savedSlot) => areSlotsEqual(slot, savedSlot))
      );

      // Create slot assignments
      const slots_creation = await fetch("/api/time_table/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_items),
      });

      if (!slots_creation) {
        alert("changes not saved");
        return;
      }

      setSavedChanges((prev) => [...prev, ...new_items]);

      setHasUnsavedChanges(false);
      // Show success message
    } catch (error) {
      console.error("Error saving timetable:", error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {current_phase === "skeleton" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Configure Timetable Structure</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slot Duration (minutes)
                </label>
                <MyInput
                  type="number"
                  value={skeleton_config.slot_duration}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      slot_duration: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <MyInput
                  type="time"
                  value={skeleton_config.start_time}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <MyInput
                  type="time"
                  value={skeleton_config.end_time}
                  onChange={(e) =>
                    setSkeletonConfig((prev) => ({
                      ...prev,
                      end_time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Break Configuration</h3>
              {skeleton_config.breaks.map((breakItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <MyInput
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
                  <MyInput
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
            <Button onClick={saveTimetable} disabled={!has_saved_changes}>
              {is_saving ? "Saving..." : "Save Timetable"}
            </Button>
            <Select
              label="Select Class"
              options={streams}
              value={selected_stream || ""}
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
                          time_slots[parseInt(conflict.slotId.split("-")[0])];
                        const teacherName = teachers?.find(
                          (teacher) => teacher.id === conflict.teacher_id
                        )?.["staff.users.name"];
                        const day =
                          days_of_week[parseInt(conflict.slotId.split("-")[1])];

                        return (
                          <li key={index} className="text-sm">
                            <span className="font-semibold">
                              {teacherName as string}
                            </span>{" "}
                            is already assigned on{" "}
                            <span className="font-semibold">{day}</span> at{" "}
                            <span className="font-semibold">
                              {timeSlot.start_time} - {timeSlot.end_time}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {selected_stream && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2">Time</th>
                      {Array.from({
                        length: skeleton_config.days_per_week,
                      }).map((_, idx) => (
                        <th key={idx} className="px-4 py-2">
                          {days_of_week[idx]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {time_slots.map((slot, idx) => (
                      <tr
                        key={idx}
                        className={slot.type === "break" ? "bg-gray-50" : ""}
                      >
                        <td className="px-4 py-2 border">
                          {slot.start_time} - {slot.end_time}
                        </td>
                        {Array.from({
                          length: skeleton_config.days_per_week,
                        }).map((_, dayIdx) => (
                          <td key={dayIdx} className="px-4 py-2 border">
                            {slot.type === "lesson" && (
                              <div className="space-y-2">
                                <Select
                                  options={subjects}
                                  value={
                                    assignments[
                                      `${idx}-${dayIdx}-${selected_stream}`
                                    ]?.subject_id || ""
                                  }
                                  onChange={(e) =>
                                    handleAssignment(
                                      `${idx}-${dayIdx}`,
                                      "subject_id",
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
                                      `${idx}-${dayIdx}-${selected_stream}`
                                    ]?.teacher_id || ""
                                  }
                                  onChange={(e) =>
                                    handleAssignment(
                                      `${idx}-${dayIdx}`,
                                      "teacher_id",
                                      Number(e.target.value)
                                    )
                                  }
                                  placeholder="Select Teacher"
                                />
                              </div>
                            )}
                          </td>
                        ))}
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
