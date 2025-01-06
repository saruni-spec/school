import React, { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  MessageCircle,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import { Button } from "./button";
import { FieldType, MyRecord } from "../types/types";
import { Input } from "./input";
import { useValidation } from "../hooks/validation_hooks";
import { useTeacherDetails } from "../context/user_context";

// Types for our components
type AssignmentAttempt = {
  id: number;
  student: MyRecord;
  answer: string;
  date_submitted: string;
  assignment_content_id: number;
  date_marked: string | null;
  remarks: string | null;
  result: number | null;
};

type Option = {
  id: string;
  text: string;
};

type AssignmentContent = {
  id: number;
  question: string;
  options: Option[]; // Changed from [] to Option[]
  assignment_attempt: AssignmentAttempt[];
};

type Assignment = {
  id: number;
  description: string;
  subject_allocation_id: number | null;
  file_path: string | null;
  assignment_content: AssignmentContent[];
};

const AttempItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs font-medium">{label}</span>
        <span className="text-gray-900 font-medium">{value}</span>
      </div>
    </div>
  );
};

const StudentAttempt = ({ attempt }) => {
  const [assesment, setAssesment] = useState("");
  const [isMarking, setIsMarking] = useState(false);
  const { teacherDetails } = useTeacherDetails();

  const remarks = useValidation({
    type: FieldType.Text,
    required: false,
  });

  const result = useValidation({
    type: FieldType.Number,
    required: false,
  });

  const markAssignmentAttempt = async () => {
    const assigment_attempt_details = {
      id: attempt.id,
      teacher_id: teacherDetails.id,
      date_marked: new Date().toISOString(),
      remarks: remarks.value,
      result: result.value,
      assessment: assesment,
    };

    const response = await fetch(`/api/teacher/mark_assignment`, {
      method: "POST",
      body: JSON.stringify(assigment_attempt_details),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setIsMarking(false);
    }
  };

  return (
    <Card className="mt-4 overflow-hidden border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <AttempItem
              label="Student"
              value={attempt.student.student_code}
              icon={<Users size={18} />}
            />
            <AttempItem
              label="Submitted"
              value={new Date(attempt.date_submitted).toLocaleDateString()}
              icon={<Clock size={18} />}
            />
            <div className="md:col-span-2">
              <AttempItem
                label="Answer"
                value={attempt.answer}
                icon={<FileText size={18} />}
              />
            </div>
          </div>

          {!attempt.date_marked && !isMarking && (
            <Button
              onClick={() => setIsMarking(true)}
              variant="outline"
              size="sm"
              className="ml-4 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
            >
              Mark Attempt
            </Button>
          )}
        </div>

        {isMarking && (
          <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setAssesment("CORRECT")}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  assesment === "CORRECT"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "text-green-600 hover:bg-green-50"
                }`}
              >
                <Check size={16} />
                Correct
              </Button>
              <Button
                onClick={() => setAssesment("INCORRECT")}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  assesment === "INCORRECT"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <X size={16} />
                Incorrect
              </Button>
              <Button
                onClick={() => setAssesment("GOOD_TRIAL")}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  assesment === "GOOD_TRIAL"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                <Award size={16} />
                Good Trial
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <Input
                  placeholder="Add remarks..."
                  value={remarks.value}
                  onChange={remarks.handle_change}
                  error={remarks.error}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Result (%)
                </label>
                <Input
                  placeholder="Total marks..."
                  value={result.value}
                  onChange={result.handle_change}
                  error={result.error}
                  type="number"
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMarking(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={markAssignmentAttempt}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Assessment
              </Button>
            </div>
          </div>
        )}

        {attempt.date_marked && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              {attempt.result === 100 ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={16} className="text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award size={16} className="text-yellow-600" />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">
                  Marked: {new Date(attempt.date_marked).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  Result: {attempt.result}%
                </div>
              </div>
            </div>
            {attempt.remarks && (
              <div className="flex items-start gap-3 mt-3 pt-3 border-t border-gray-200">
                <MessageSquare size={16} className="text-gray-400 mt-1" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Remarks:</span>{" "}
                  {attempt.remarks}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AssignmentContent: React.FC<{ content: AssignmentContent }> = ({
  content,
}) => {
  const [showAttempts, setShowAttempts] = useState(false);

  // Calculate statistics
  const totalAttempts = content.assignment_attempt.length;
  const markedAttempts = content.assignment_attempt.filter(
    (a) => a.date_marked
  ).length;
  const averageScore =
    content.assignment_attempt
      .filter((a) => a.result !== null)
      .reduce((acc, curr) => acc + (curr.result || 0), 0) / markedAttempts || 0;

  return (
    <div className="mt-6 first:mt-0">
      <div className="flex flex-col space-y-4">
        {/* Question Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div
            className="p-4 flex items-start justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowAttempts(!showAttempts)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Question {content.id}
                </div>
                {showAttempts ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
              <p className="text-gray-700 font-medium">{content.question}</p>

              {/* Options Grid */}
              {content.options && content.options.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.options.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm text-gray-700">
                        {option.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics Pills */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle size={16} className="text-blue-500" />
                  <span className="text-gray-600">
                    {totalAttempts} attempts
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-gray-600">{markedAttempts} marked</span>
                </div>
              </div>
              {markedAttempts > 0 && (
                <div className="text-sm font-medium text-gray-700">
                  Avg. Score: {averageScore.toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          {/* Attempts Section */}
          {showAttempts && (
            <div className="border-t border-gray-100">
              <div className="p-4 bg-gray-50 rounded-b-xl">
                <div className="space-y-4">
                  {content.assignment_attempt.map((attempt) => (
                    <StudentAttempt key={attempt.id} attempt={attempt} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AssignmentCard: React.FC<{ assignment: Assignment }> = ({
  assignment,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate assignment statistics
  const totalQuestions = assignment.assignment_content.length;
  const totalAttempts = assignment.assignment_content.reduce(
    (acc, content) => acc + content.assignment_attempt.length,
    0
  );

  return (
    <Card className="mb-6 border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start md:items-center gap-3">
            {expanded ? (
              <ChevronDown size={24} className="text-blue-500 mt-1 md:mt-0" />
            ) : (
              <ChevronRight size={24} className="text-blue-500 mt-1 md:mt-0" />
            )}
            <div>
              <CardTitle className="text-xl text-gray-900">
                {assignment.description}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {totalQuestions} Questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {totalAttempts} Total Attempts
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {assignment.file_path && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText size={16} className="mr-2" />
                View Attachment
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-6 bg-gray-50">
          {assignment.assignment_content.map((content) => (
            <AssignmentContent key={content.id} content={content} />
          ))}
        </CardContent>
      )}
    </Card>
  );
};
