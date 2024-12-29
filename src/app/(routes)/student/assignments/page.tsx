"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useStudentDetails } from "@/app/context/user_context";
import { Download, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/app/components/button";
import { record } from "@/app/types/types";

const Assignments = () => {
  const [assignments, setAssignments] = useState<record[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<record>();
  const [attemptedAssignments, setAttemptedAssignments] = useState<record[]>(
    []
  );
  const [nonAttemptedAssignments, setNonAttemptedAssignments] = useState<
    record[]
  >([]);
  const [view, setView] = useState("list"); // 'list' or 'attempt'
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { studentDetails } = useStudentDetails();

  // Get the assignments
  const getAssignments = useCallback(async () => {
    const response = await fetch(
      `/api/student/assignment?class_progression_id=${studentDetails?.student_class[0].class_progression.id}&student_code=${studentDetails?.student_code}`
    );
    if (!response.ok) {
      console.error("error fetching student assignments");
      return;
    }
    const data = await response.json();
    console.log(data);
    setAssignments(data);
  }, [studentDetails]);

  useEffect(() => {
    getAssignments();
  }, [getAssignments]);

  const handleFileDownload = (filePath: string) => {
    // Implement file download logic here
    window.open(filePath, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAttemptAssignment = (assignment: record) => {
    setSelectedAssignment(assignment);
    setView("attempt");
  };
  useEffect(() => {
    if (!assignments) return;
    // Filter assignments into attempted and non-attempted
    const attemptedAssignments = assignments.filter(
      (a) => a.assignment_attempt?.length > 0
    );
    setAttemptedAssignments(attemptedAssignments);
    const nonAttemptedAssignments = assignments.filter(
      (a) => !a.assignment_attempt?.length
    );
    setNonAttemptedAssignments(nonAttemptedAssignments);
  }, [assignments]);

  const AssignmentAttemptView = () => (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {selectedAssignment && (
        <>
          <Button
            onClick={() => setView("list")}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to assignments
          </Button>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">
              {selectedAssignment.assignment?.description}
            </h3>
            <p className="text-gray-600 mb-4">
              Due: {formatDate(selectedAssignment.assignment?.due_date)}
            </p>

            <div className="space-y-4">
              <div className="font-medium">
                {selectedAssignment.question as string}
              </div>

              {selectedAssignment.options?.length > 0 ? (
                <div className="space-y-2">
                  {selectedAssignment?.options?.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      {Object.values(option).includes("no options") ? (
                        <textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          rows={4}
                          placeholder="Enter your answer here..."
                        />
                      ) : (
                        <>
                          <input
                            type="radio"
                            name="answer"
                            value={option.text}
                            checked={currentAnswer === option}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            className="form-radio"
                          />
                          {option.text}
                        </>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <></>
              )}

              <Button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Submit Answer
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const AssignmentListView = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Assignments</h2>

      {/* Non-attempted assignments section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Pending Assignments
        </h3>
        <div className="space-y-4">
          {nonAttemptedAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {assignment.assignment?.description}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Subject:{" "}
                    {
                      assignment.assignment?.subject_allocation?.subject_grade
                        ?.name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {formatDate(assignment.assignment?.due_date)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {assignment.assignment?.file_path && (
                    <Button
                      onClick={() =>
                        handleFileDownload(assignment.assignment.file_path)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  )}
                  {assignment.question && (
                    <Button
                      onClick={() => handleAttemptAssignment(assignment)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      Attempt <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {nonAttemptedAssignments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No pending assignments
            </p>
          )}
        </div>
      </div>

      {/* Attempted assignments section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Completed Assignments
        </h3>
        <div className="space-y-4">
          {attemptedAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {assignment.assignment?.description}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Subject:{" "}
                    {
                      assignment.assignment?.subject_allocation?.subject_grade
                        ?.name
                    }
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Submitted:</span>{" "}
                      {formatDate(
                        assignment.assignment_attempt[0]?.date_submitted
                      )}
                    </p>
                    {assignment.assignment_attempt[0]?.result && (
                      <p className="text-sm">
                        <span className="font-medium">Result:</span>{" "}
                        {assignment.assignment_attempt[0].result}%
                      </p>
                    )}
                    {assignment.assignment_attempt[0]?.remarks && (
                      <p className="text-sm">
                        <span className="font-medium">Remarks:</span>{" "}
                        {assignment.assignment_attempt[0].remarks}
                      </p>
                    )}
                  </div>
                </div>
                {assignment.assignment?.file_path && (
                  <Button
                    onClick={() =>
                      handleFileDownload(assignment.assignment.file_path)
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {attemptedAssignments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No completed assignments yet
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "list" ? <AssignmentListView /> : <AssignmentAttemptView />}
    </div>
  );
};

export default Assignments;
