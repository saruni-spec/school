"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import { MyInput } from "@/app/components/input";
import { Button } from "@/app/components/button";
import { Alert, AlertDescription } from "@/app/components/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/table";
import { LoadingSpinner } from "@/app/components/loading";

const ExamMarksForm = () => {
  const examSittingId = 1;
  const teacherId = 1;
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examSitting = await fetchExamSitting(examSittingId);
        const streamStudents = await fetchStreamStudents(examSitting.stream_id);

        setExamData(examSitting);
        setStudents(streamStudents);

        const initialMarks = {};
        streamStudents.forEach((student) => {
          initialMarks[student.id] = "";
        });
        setMarks(initialMarks);
      } catch (err) {
        setError("Failed to load exam data");
      }
    };

    fetchData();
  }, [examSittingId]);

  const handleMarkChange = (studentId, value) => {
    if (
      value === "" ||
      (Number(value) >= 0 && Number(value) <= examData.total_marks)
    ) {
      setMarks((prev) => ({
        ...prev,
        [studentId]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const isValid = Object.values(marks).every(
        (mark) =>
          mark !== "" &&
          Number(mark) >= 0 &&
          Number(mark) <= examData.total_marks
      );

      if (!isValid) {
        throw new Error(
          "Please ensure all marks are entered and within valid range"
        );
      }

      const results = Object.entries(marks).map(([studentId, mark]) => ({
        student_id: parseInt(studentId),
        exam_sitting_id: examSittingId,
        marks: parseInt(mark),
        teacher_id: teacherId,
      }));

      await saveResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Alert variant="error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Card>
        <CardHeader>
          <CardTitle>Record Exam Marks</CardTitle>
          <div className="text-sm text-gray-500">
            <p>Exam: {examData?.exam?.name}</p>
            <p>Total Marks: {examData?.total_marks}</p>
            <p>Date: {new Date(examData?.sitting_date).toLocaleDateString()}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead className="w-32">Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <MyInput
                      type="number"
                      min={0}
                      max={examData.total_marks}
                      value={marks[student.id]}
                      onChange={(e) =>
                        handleMarkChange(student.id, e.target.value)
                      }
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Marks"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default ExamMarksForm;
