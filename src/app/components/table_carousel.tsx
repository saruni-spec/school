import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Select } from "./select";

const TimetableCarousel = ({
  streams,
  time_slots,
  days_per_week,
  subjects,
  teachers,
  assignments,
  handle_assignment,
  selected_stream,
  set_selected_stream,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === streams.length - 1 ? 0 : prevIndex + 1
    );
    set_selected_stream(
      streams[currentIndex === streams.length - 1 ? 0 : currentIndex + 1].id
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? streams.length - 1 : prevIndex - 1
    );
    set_selected_stream(
      streams[currentIndex === 0 ? streams.length - 1 : currentIndex - 1].id
    );
  };

  const days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="primary"
          size="sm"
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center w-full">
          <h3 className="text-xl font-bold">
            {streams[currentIndex]?.name || "Loading..."}
          </h3>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2">Time</th>
              {Array.from({ length: days_per_week }).map((_, idx) => (
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
                {Array.from({ length: days_per_week }).map((_, dayIdx) => (
                  <td key={dayIdx} className="px-4 py-2 border">
                    {slot.type === "lesson" && (
                      <div className="space-y-2">
                        <Select
                          options={subjects}
                          value={
                            assignments[`${idx}-${dayIdx}-${selected_stream}`]
                              ?.subject_id || ""
                          }
                          onChange={(e) =>
                            handle_assignment(
                              `${idx}-${dayIdx}`,
                              "subject_id",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Select Subject"
                        />
                        <Select
                          options={teachers}
                          show_field="staff.users.name"
                          value={
                            assignments[`${idx}-${dayIdx}-${selected_stream}`]
                              ?.teacher_id || ""
                          }
                          onChange={(e) =>
                            handle_assignment(
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

      <div className="flex justify-center mt-4 gap-2">
        {streams.map((_, index) => (
          <Button
            key={index}
            variant={index === currentIndex ? "primary" : "primary"}
            size="sm"
            onClick={() => {
              setCurrentIndex(index);
              set_selected_stream(streams[index].id);
            }}
            className="w-8 h-8 rounded-full p-0"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimetableCarousel;
