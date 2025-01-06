"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useStudentDetails } from "@/app/context/user_context";
import {
  Download,
  ChevronRight,
  Clock,
  CheckCircle,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/app/components/button";
import { MyRecord } from "@/app/types/types";
import RadioInputs from "@/app/components/radio";
import { Card, CardTitle } from "@/app/components/card";
import { register } from "@/app/api_functions/functions";
import { Input } from "@/app/components/input";
import { LoadingSpinner } from "@/app/components/loading";

const Assignments = () => {
  const [assignments, setAssignments] = useState<MyRecord[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<MyRecord>();
  const [attemptedAssignments, setAttemptedAssignments] = useState<MyRecord[]>(
    []
  );
  const [nonAttemptedAssignments, setNonAttemptedAssignments] = useState<
    MyRecord[]
  >([]);
  const [view, setView] = useState("list"); // 'list' or 'attempt'
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { studentDetails } = useStudentDetails();

  // Get the assignments
  const getAssignments = useCallback(async () => {
    if (!studentDetails) return;
    try {
      const response = await fetch(
        `/api/student/assignment?class_progression_id=${studentDetails.student_class[0].class_progression.id}&student_code=${studentDetails?.student_code}`
      );
      if (!response.ok) {
        console.error("error fetching student assignments");
        return;
      }
      const data = await response.json();
      const attemptedAssignments = data.filter(
        (a) => a.assignment_attempt?.length > 0
      );
      setAttemptedAssignments(attemptedAssignments);
      const nonAttemptedAssignments = data.filter(
        (a) => !a.assignment_attempt?.length
      );
      setNonAttemptedAssignments(nonAttemptedAssignments);
      setAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  }, [studentDetails]);

  useEffect(() => {
    getAssignments();
  }, [getAssignments]);

  const handleFileDownload = (filePath: string) => {
    // Implement file download logic here
    window.open(filePath, "_blank");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAttemptAssignment = useCallback((assignment: MyRecord) => {
    setSelectedAssignment(assignment);
    setView("attempt");
  }, []);

  const handleOptionSelect = (option) => {
    setCurrentAnswer(option.text);
  };

  const submitAnswer = async () => {
    const attempt = {
      assignment_content_id: selectedAssignment?.id,
      answer: currentAnswer,
      student_id: studentDetails?.id,
      date_submitted: new Date().toISOString(),
    };

    await register({
      model_name: "assignment_attempt",
      data: attempt,
    });

    getAssignments();
    setView("list");
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto px-4">
          {view === "list" ? (
            <div>
              {assignments.length > 0 && (
                <AssignmentListView
                  nonAttemptedAssignments={nonAttemptedAssignments}
                  attemptedAssignments={attemptedAssignments}
                  handleFileDownload={handleFileDownload}
                  handleAttemptAssignment={handleAttemptAssignment}
                  formatDate={formatDate}
                />
              )}
            </div>
          ) : (
            selectedAssignment && (
              <AssignmentAttemptView
                selectedAssignment={selectedAssignment}
                setView={setView}
                currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}
                handleOptionSelect={handleOptionSelect}
                submitAnswer={submitAnswer}
                formatDate={formatDate}
              />
            )
          )}
        </div>
      </div>
    </Suspense>
  );
};

interface AssignmentAttemptViewProps {
  selectedAssignment: MyRecord;
  setView: (view: string) => void;
  currentAnswer: string;
  setCurrentAnswer: (answer: string) => void;
  handleOptionSelect: (option: any) => void;
  submitAnswer: () => void;
  formatDate: (dateString: string) => string;
}

const AssignmentAttemptView: React.FC<AssignmentAttemptViewProps> = ({
  selectedAssignment,
  setView,
  currentAnswer,
  setCurrentAnswer,
  handleOptionSelect,
  submitAnswer,
  formatDate,
}) => (
  <div className="max-w-3xl mx-auto">
    <Button
      onClick={() => setView("list")}
      className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
    >
      ← Back to assignments
    </Button>

    <Card className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-indigo-500">
      <CardTitle className="text-xl font-bold text-gray-800 mb-4">
        {selectedAssignment.assignment?.description}
      </CardTitle>

      <div className="flex items-center mb-6 text-indigo-600">
        <Clock className="w-5 h-5 mr-2" />
        <span className="font-medium">
          Due: {formatDate(selectedAssignment.assignment?.due_date)}
        </span>
      </div>

      <div className="space-y-6">
        <div className="text-lg text-gray-700 font-medium border-l-4 border-indigo-200 pl-4">
          {selectedAssignment.question}
        </div>

        {selectedAssignment.options && selectedAssignment.options.length > 0 ? (
          <div className="mt-6">
            {Object.values(selectedAssignment.options[0]).includes(
              "no options"
            ) ? (
              <Input
                isTextArea
                label="Your Answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                required
                className="border-2 border-indigo-100 rounded-lg focus:border-indigo-500"
              />
            ) : (
              <RadioInputs
                name="options"
                options={selectedAssignment.options}
                onChange={handleOptionSelect}
                id_field="text"
                value_field="text"
                show_field="text"
              />
            )}
          </div>
        ) : null}

        <Button
          onClick={submitAnswer}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Submit Assignment
        </Button>
      </div>
    </Card>
  </div>
);

interface AssignmentListViewProps {
  nonAttemptedAssignments: MyRecord[];
  attemptedAssignments: MyRecord[];
  handleFileDownload: (filePath: string) => void;
  handleAttemptAssignment: (assignment: MyRecord) => void;
  formatDate: (dateString: string) => string;
}

const AssignmentListView: React.FC<AssignmentListViewProps> = ({
  nonAttemptedAssignments,
  attemptedAssignments,
  handleFileDownload,
  handleAttemptAssignment,
  formatDate,
}) => (
  <div className="space-y-8">
    {/* Pending Assignments */}
    <section>
      <div className="flex items-center mb-6">
        <Clock className="w-6 h-6 text-orange-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Pending Assignments</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {nonAttemptedAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6 border-l-4 border-orange-400">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {assignment.assignment?.description}
              </h3>
              <p className="text-indigo-600 font-medium mb-2">
                {assignment.assignment?.subject_allocation?.subject_grade?.name}
              </p>
              <div className="flex items-center text-gray-600 mb-4">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  Due: {formatDate(assignment.assignment?.due_date)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                {assignment.assignment?.file_path && (
                  <Button
                    onClick={() =>
                      handleFileDownload(assignment.assignment.file_path)
                    }
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                )}
                {assignment.question && (
                  <Button
                    onClick={() => handleAttemptAssignment(assignment)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center font-medium shadow-md transition-all duration-200"
                  >
                    Start Assignment <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {nonAttemptedAssignments.length === 0 && (
          <div className="col-span-2 text-center py-8 bg-white rounded-xl">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">
              All caught up! No pending assignments
            </p>
          </div>
        )}
      </div>
    </section>

    {/* Completed Assignments */}
    <section>
      <div className="flex items-center mb-6">
        <Award className="w-6 h-6 text-green-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">
          Completed Assignments
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {attemptedAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6 border-l-4 border-green-400">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {assignment.assignment?.description}
              </h3>
              <p className="text-indigo-600 font-medium mb-2">
                {assignment.assignment?.subject_allocation?.subject_grade?.name}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Submitted:</span>
                  {formatDate(assignment.assignment_attempt[0]?.date_submitted)}
                </p>
                {assignment.assignment_attempt[0]?.result && (
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Score:</span>
                    <span className="text-green-600 font-bold">
                      {assignment.assignment_attempt[0].result}%
                    </span>
                  </p>
                )}
                {assignment.assignment_attempt[0]?.remarks && (
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Feedback:</span>
                    {assignment.assignment_attempt[0].remarks}
                  </p>
                )}
              </div>
              {assignment.assignment?.file_path && (
                <Button
                  onClick={() =>
                    handleFileDownload(assignment.assignment.file_path)
                  }
                  className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <Download className="w-5 h-5 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </Card>
        ))}
        {attemptedAssignments.length === 0 && (
          <div className="col-span-2 text-center py-8 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">
              No completed assignments yet
            </p>
          </div>
        )}
      </div>
    </section>
  </div>
);

export default Assignments;
