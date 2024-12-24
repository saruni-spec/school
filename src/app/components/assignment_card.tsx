import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "./button";

// Types for our components
type AssignmentAttempt = {
  id: number;
  student_id: number;
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

// Student Attempt Component
const StudentAttempt: React.FC<{ attempt: AssignmentAttempt }> = ({
  attempt,
}) => {
  return (
    <div className="ml-8 p-4 border-l-2 border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users size={16} />
        <span>Student ID: {attempt.student_id}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>
          Submitted: {new Date(attempt.date_submitted).toLocaleDateString()}
        </span>
      </div>
      {attempt.date_marked && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <div className="font-medium">
            Marked: {new Date(attempt.date_marked).toLocaleDateString()}
          </div>
          <div className="text-sm mt-1">Result: {attempt.result}%</div>
          {attempt.remarks && (
            <div className="text-sm mt-1">Remarks: {attempt.remarks}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Assignment Content Component
const AssignmentContent: React.FC<{ content: AssignmentContent }> = ({
  content,
}) => {
  const [showAttempts, setShowAttempts] = useState(false);

  return (
    <Card className="mt-4">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setShowAttempts(!showAttempts)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showAttempts ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <h4 className="text-base font-light pb-3">Question {content.id}</h4>
          </div>
          <div className="text-sm text-gray-500">
            {content.assignment_attempt.length} attempts
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-gray-700">{content.question}</p>
          {content.options && content.options.length > 0 && (
            <div className="mt-2 ml-4">
              {content.options.map((option, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {option.text}
                </div>
              ))}
            </div>
          )}
        </div>
        {showAttempts && (
          <div className="space-y-4">
            {content.assignment_attempt.map((attempt) => (
              <StudentAttempt key={attempt.id} attempt={attempt} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Assignment Card Component
export const AssignmentCard: React.FC<{ assignment: Assignment }> = ({
  assignment,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <CardTitle className="text-lg">{assignment.description}</CardTitle>
          </div>
          {assignment.file_path && (
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              View Attachment
            </Button>
          )}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          {assignment.assignment_content.map((content) => (
            <AssignmentContent key={content.id} content={content} />
          ))}
        </CardContent>
      )}
    </Card>
  );
};
