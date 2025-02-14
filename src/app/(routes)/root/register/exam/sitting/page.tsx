"use client";
import {
  fetchTable,
  getDataFromApi,
  register,
} from "@/app/api_functions/functions";
import { Alert, AlertDescription } from "@/app/components/alert";
import { Button } from "@/app/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
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
  type: "exam_slot" | "break";
}

interface SkeletonConfig {
  id?: number;
  slot_duration: number;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  breaks: { startTime: string; duration: number }[];
  school_id?: number;
  semester_id?: number;
}

interface TempSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  time_table_id?: number;
  sitting: TempSlotAssignment[];
}

// Update TempSlotAssignment interface to include sitting_date
interface TempSlotAssignment {
  teacher_id: number;
  subject_allocation_id: number;
  sitting_date: Date;
}

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
    slot_duration: 120,
    start_time: "08:00",
    end_time: "16:00",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    breaks: [],
    school_id: school_id,
    semester_id: current_semester,
  });

  // Generated slots state
  const [time_slots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Selected class/stream for assignment
  const [selected_stream, setSelectedStream] = useState<number | null>(null);

  // Assignment state
  const [assignments, setAssignments] = useState<
    Record<string, TempSlotAssignment>
  >({});
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
      const sittings: TempSlotAssignment[] = slot.exam_sitting.map(
        (sitting) => ({
          subject_allocation_id: sitting.subject_allocation_id,
          sitting_date: sitting.sitting_date,
          teacher_id: sitting.teacher_id,
        })
      );

      const tempSlot: TempSlot = {
        day_of_week: dayOfWeekToNumber(slot.day_of_week),
        start_time: slot.start_time,
        end_time: slot.end_time,
        sitting: sittings,
      };

      if (slot.room_number) {
        tempSlot.room_number = slot.room_number;
      }

      return tempSlot;
    });
  }, []);

  //get slots saved in db
  const getSlotsInDb = useCallback(async () => {
    const data = await getDataFromApi(
      `/api/time_table/exam?school_id=${school_id}&semester_id=${current_semester}`
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
    const new_assignments: Record<string, TempSlotAssignment> = {};

    formatted_slots.forEach((slot) => {
      // Convert the time to slot index
      const slot_index = time_slots.findIndex(
        (timeSlot) =>
          timeSlot.start_time === slot.start_time &&
          timeSlot.end_time === slot.end_time
      );

      if (slot_index !== -1) {
        slot.sitting.forEach((assignment) => {
          const key = `${slot_index}-${slot.day_of_week}-${assignment.subject_allocation_id}`;
          new_assignments[key] = {
            teacher_id: assignment.teacher_id,
            subject_allocation_id: assignment.subject_allocation_id,
            sitting_date: assignment.sitting_date,
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
          name: `ET-${school_id}/${current_semester}/${new Date().getFullYear()}`,
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
          type: "exam_slot",
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
    teacher_id: number,
    subject_allocation_id: number,
    sitting_date: string
  ) => {
    setTempSlots((prev) => {
      const slot_index = prev.findIndex(
        (slot) =>
          slot.day_of_week === day_index &&
          slot.start_time === time_slot.start_time &&
          slot.end_time === time_slot.end_time
      );

      if (slot_index === -1) {
        // Create new slot with sitting
        return [
          ...prev,
          {
            day_of_week: day_index,
            start_time: time_slot.start_time,
            end_time: time_slot.end_time,
            sitting: [
              {
                teacher_id,
                subject_allocation_id,
                sitting_date,
              },
            ],
          },
        ];
      }

      // Update existing slot's sittings
      const updated_slots = [...prev];
      const existing_sitting_index = updated_slots[
        slot_index
      ].sitting?.findIndex(
        (s) => s.subject_allocation_id === subject_allocation_id
      );

      if (
        existing_sitting_index === -1 ||
        existing_sitting_index === undefined
      ) {
        updated_slots[slot_index].sitting = [
          ...(updated_slots[slot_index].sitting || []),
          {
            teacher_id,
            subject_allocation_id,
            sitting_date,
          },
        ];
      } else {
        updated_slots[slot_index].sitting[existing_sitting_index] = {
          teacher_id,
          subject_allocation_id,
          sitting_date,
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
    field: "teacher_id" | "subject_allocation_id",
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
      (field === "teacher_id" && current_assignment.subject_allocation_id) ||
      (field === "subject_allocation_id" && current_assignment.teacher_id)
    ) {
      updateTempStorage(
        day_index,
        time_slot,
        selected_stream!,
        field === "teacher_id" ? value : current_assignment.teacher_id!,
        field === "subject_allocation_id"
          ? value
          : current_assignment.subject_allocation_id!
      );
    }
  };

  // Function to compare two slot objects deeply
  const areSlotsEqual = (slot1: TempSlot, savedSlot: any) => {
    return (
      slot1.start_time === savedSlot.start_time &&
      slot1.end_time === savedSlot.end_time &&
      days_of_week[slot1.day_of_week] === savedSlot.day_of_week &&
      slot1.room_number === savedSlot.room_number &&
      JSON.stringify(
        slot1.sitting.sort(
          (a, b) => a.subject_allocation_id - b.subject_allocation_id
        )
      ) ===
        JSON.stringify(
          savedSlot.sitting.sort(
            (a, b) => a.subject_allocation_id - b.subject_allocation_id
          )
        )
    );
  };
  // Function to save to database
  const saveTimetable = async () => {
    try {
      setIsSaving(true);

      // Format slots according to API requirements
      const formatted_slots = temp_slots.map((slot) => {
        // Format each slot to match API expectations
        return {
          start_time: slot.start_time,
          end_time: slot.end_time,
          day_of_week: days_of_week[slot.day_of_week],
          room_number: slot.room_number,
          time_table_id: skeleton_config.id,
          // Format sittings to match API expectations
          sitting: slot.sitting.map((slot_sitting) => ({
            teacher_id: slot_sitting.teacher_id,
            subject_allocation_id: slot_sitting.subject_allocation_id,
            sitting_date: slot_sitting.sitting_date,
          })),
        };
      });

      // Filter out slots that have already been saved
      const new_slots = formatted_slots.filter(
        (slot) =>
          !saved_changes.some((savedSlot) => areSlotsEqual(slot, savedSlot))
      );

      // Only send if there are new changes
      if (new_slots.length === 0) {
        setIsSaving(false);
        return;
      }

      // Send to API
      const response = await fetch("/api/time_table/sittings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_slots),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const saved_data = await response.json();

      // Update saved changes with newly saved slots
      setSavedChanges((prev) => [...prev, ...new_slots]);
      setHasUnsavedChanges(false);

      // Update local state with saved data
      setTempSlots((prev) => {
        return prev.map((slot) => {
          const saved_slot = saved_data.find(
            (s: any) =>
              s.start_time === slot.start_time &&
              s.day_of_week === days_of_week[slot.day_of_week]
          );
          if (saved_slot) {
            return {
              ...slot,
              time_table_id: saved_slot.time_table_id,
              sittings: saved_slot.exam_sitting.map((sitting: any) => ({
                subject_allocation: {
                  id: sitting.subject_allocation.id,
                  teacher_id: sitting.teacher_id,
                  subject_allocation_id: sitting.subject_allocation_id,
                },
                sitting_date: sitting.sitting_date,
              })),
            };
          }
          return slot;
        });
      });
    } catch (error) {
      console.error("Error saving timetable:", error);
      // Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  // Generate array of dates between start and end date
  const generateDateRange = (start_date, end_date) => {
    const dates = [];
    const currentDate = new Date(start_date);
    const endDate = new Date(end_date);

    while (currentDate <= endDate) {
      dates.push({
        date: currentDate.toISOString().split("T")[0],
        day: currentDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dates = generateDateRange(
    skeleton_config.start_date,
    skeleton_config.end_date
  );

  return (
    <div className="p-4 space-y-6">
      {/* Phase Indicator */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Timetable Creator</h1>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              current_phase === "skeleton" ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <span className="text-sm">Skeleton Setup</span>
          <div
            className={`h-3 w-3 rounded-full ${
              current_phase === "assignment" ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <span className="text-sm">Slot Assignment</span>
        </div>
      </div>

      {/* Skeleton Configuration Phase */}
      {current_phase === "skeleton" && (
        <Card>
          <CardHeader>
            <CardTitle>Timetable Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <MyInput
                  type="date"
                  value={skeleton_config.start_date}
                  onChange={(e) =>
                    setSkeletonConfig({
                      ...skeleton_config,
                      start_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <MyInput
                  type="date"
                  value={skeleton_config.end_date}
                  onChange={(e) =>
                    setSkeletonConfig({
                      ...skeleton_config,
                      end_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slot Duration (minutes)
                </label>
                <MyInput
                  type="number"
                  value={skeleton_config.slot_duration}
                  onChange={(e) =>
                    setSkeletonConfig({
                      ...skeleton_config,
                      slot_duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Daily Start Time
                </label>
                <MyInput
                  type="time"
                  value={skeleton_config.start_time}
                  onChange={(e) =>
                    setSkeletonConfig({
                      ...skeleton_config,
                      start_time: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Daily End Time
                </label>
                <MyInput
                  type="time"
                  value={skeleton_config.end_time}
                  onChange={(e) =>
                    setSkeletonConfig({
                      ...skeleton_config,
                      end_time: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Break Configuration */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Daily Breaks</h3>
              {skeleton_config.breaks.map((breakItem, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <MyInput
                    type="time"
                    value={breakItem.startTime}
                    onChange={(e) => {
                      const newBreaks = [...skeleton_config.breaks];
                      newBreaks[index].startTime = e.target.value;
                      setSkeletonConfig({
                        ...skeleton_config,
                        breaks: newBreaks,
                      });
                    }}
                  />
                  <MyInput
                    type="number"
                    placeholder="Duration (mins)"
                    value={breakItem.duration}
                    onChange={(e) => {
                      const newBreaks = [...skeleton_config.breaks];
                      newBreaks[index].duration = parseInt(e.target.value);
                      setSkeletonConfig({
                        ...skeleton_config,
                        breaks: newBreaks,
                      });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newBreaks = skeleton_config.breaks.filter(
                        (_, i) => i !== index
                      );
                      setSkeletonConfig({
                        ...skeleton_config,
                        breaks: newBreaks,
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setSkeletonConfig({
                    ...skeleton_config,
                    breaks: [
                      ...skeleton_config.breaks,
                      { startTime: "", duration: 30 },
                    ],
                  });
                }}
              >
                Add Break
              </Button>
            </div>

            <Button className="mt-4 w-full" onClick={generateTimeSlots}>
              Generate Timetable
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assignment Phase */}
      {current_phase === "assignment" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slot Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Stream Selection */}
              <div className="mb-4">
                <Select
                  label="Select Stream"
                  options={streams}
                  value={selected_stream?.toString()}
                  onChange={(e) => setSelectedStream(parseInt(e.target.value))}
                  placeholder="Select a stream"
                  id="stream-select"
                  required
                />
              </div>

              {/* Timetable Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border">Time</th>
                      {dates.map((dateObj, index) => (
                        <th key={index} className="p-2 border text-center">
                          <div>{dateObj.date}</div>
                          <div className="text-sm text-gray-600">
                            {dateObj.day}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {time_slots.map((slot, slot_index) => (
                      <tr key={slot_index}>
                        <td className="p-2 border whitespace-nowrap">
                          {slot.start_time} - {slot.end_time}
                        </td>
                        {dates.map((dateObj, date_index) => (
                          <td
                            key={`${slot_index}-${date_index}`}
                            className="p-2 border"
                          >
                            {slot.type === "break" ? (
                              <div className="bg-gray-100 p-2 text-center">
                                Break
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Select
                                  options={subjects}
                                  value={assignments[
                                    `${slot_index}-${dateObj.date}-${selected_stream}`
                                  ]?.subject_allocation_id?.toString()}
                                  onChange={(e) =>
                                    handleAssignment(
                                      `${slot_index}-${dateObj.date}`,
                                      "subject_allocation_id",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  placeholder="Select subject"
                                  id={`subject-${slot_index}-${dateObj.date}`}
                                />

                                <Select
                                  options={teachers}
                                  value={assignments[
                                    `${slot_index}-${dateObj.date}-${selected_stream}`
                                  ]?.teacher_id?.toString()}
                                  onChange={(e) =>
                                    handleAssignment(
                                      `${slot_index}-${dateObj.date}`,
                                      "teacher_id",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  show_field={"staff.school_code"}
                                  placeholder="Select teacher"
                                  id={`teacher-${slot_index}-${dateObj.date}`}
                                />

                                <MyInput
                                  type="text"
                                  placeholder="Room number"
                                  value={
                                    assignments[
                                      `${slot_index}-${dateObj.date}-${selected_stream}`
                                    ]?.room_number || ""
                                  }
                                  onChange={(e) => {
                                    const assignment_key = `${slot_index}-${dateObj.date}-${selected_stream}`;
                                    setAssignments((prev) => ({
                                      ...prev,
                                      [assignment_key]: {
                                        ...prev[assignment_key],
                                        room_number: e.target.value,
                                      },
                                    }));
                                  }}
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
            </CardContent>
          </Card>

          {/* Conflicts Alert */}
          {conflicts.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {conflicts.map((conflict, index) => (
                  <div key={index}>{conflict.message}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Save Button */}
          <Button
            className="w-full"
            onClick={saveTimetable}
            disabled={is_saving || !has_saved_changes}
          >
            {is_saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimetableCreator;
