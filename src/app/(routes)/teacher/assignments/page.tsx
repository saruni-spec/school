"use client";
import { AssignmentCard } from "@/app/components/assignment_card";
import CreateAssignment from "@/app/components/assignment_creator";
import { Button } from "@/app/components/button";
import { LoadingSpinner } from "@/app/components/loading";
import { useTeacherDetails } from "@/app/context/user_context";
import { Assignment } from "@/app/types/types";
import { Suspense, useCallback, useEffect, useState } from "react";

const Assignments = () => {
  const [page, setPage] = useState<"view" | "create">("view");
  const [myAssignments, setMyAssignments] = useState<Assignment[]>([]);
  const { teacherDetails } = useTeacherDetails();

  const getAssignments = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/teacher/get_assignments/${teacherDetails.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setMyAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
    }
  }, [teacherDetails]);

  useEffect(() => {
    getAssignments();
  }, [getAssignments]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Assignments</h1>
          <Button
            onClick={() => setPage(page === "view" ? "create" : "view")}
            variant="primary"
          >
            {page === "view" ? "Create Assignment" : "View Assignments"}
          </Button>
        </div>

        {page === "view" && (
          <div className="space-y-6">
            {myAssignments.length === 0 ? (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No assignments created yet.</p>
                <Button onClick={() => setPage("create")} className="mt-4">
                  Create Your First Assignment
                </Button>
              </div>
            ) : (
              myAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            )}
          </div>
        )}
        {page === "create" && <CreateAssignment />}
      </div>
    </Suspense>
  );
};

export default Assignments;
