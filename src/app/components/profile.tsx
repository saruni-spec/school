import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/app/components/card";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useUser } from "../context/user_context";
import { User } from "../api_functions/api_types";

const UserProfile = () => {
  const [userData, setUserData] = useState<User>();

  const { user } = useUser();

  const getUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/get/users?users_id=${user?.id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }, [user]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Suspense>
      <Card className="w-full max-w-2xl mx-auto mt-6">
        {userData && (
          <>
            <CardHeader className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={"/default-avatar.png"}
                  alt={`${userData.first_name} ${userData.last_name}`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                {userData.phone && (
                  <p>
                    <strong>Phone:</strong> {userData.phone}
                  </p>
                )}
                {userData.date_of_birth && (
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(userData.date_of_birth).toLocaleDateString()}
                  </p>
                )}
                {userData.address && (
                  <p>
                    <strong>Address:</strong> {userData.address}
                  </p>
                )}
              </div>

              {userData.student && userData.student[0] && (
                <>
                  <div className="mt-4">
                    <h3 className="font-semibold">Student Details</h3>
                    <p>
                      Admission Number:{" "}
                      {userData?.student?.[0]?.admission_number || "N/A"}
                    </p>
                    <p>
                      Student Code:{" "}
                      {userData?.student?.[0]?.student_code || "N/A"}
                    </p>
                  </div>
                </>
              )}

              {userData.staff && userData.staff[0] && (
                <>
                  <div className="mt-4">
                    <h3 className="font-semibold">Staff Details</h3>
                    <p>
                      Department: {userData.staff[0].department?.name || "N/A"}
                    </p>
                    <p>
                      Employment Status: {userData.staff[0].employment_status}
                    </p>
                    <p>Domain Role: {userData.staff[0].domain_role}</p>
                  </div>
                  {userData.staff[0].teacher[0] && (
                    <>
                      <div className="mt-4">
                        <h3 className="font-semibold">Teacher Details</h3>
                        <p>
                          Active:{" "}
                          {userData.staff[0].teacher[0].is_active
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </>
                  )}
                  {userData.staff[0].school_leader[0] && (
                    <>
                      <div className="mt-4">
                        <h3 className="font-semibold">School Leader Details</h3>
                        <p>
                          {userData.staff[0].school_leader[0].academic_year && (
                            <>
                              Academic Year:{" "}
                              userData.staff[0].school_leader[0].academic_year[0]
                              ?.year
                            </>
                          )}
                        </p>
                        {userData.staff[0].school_leader[0].date_removed && (
                          <p>
                            Removed Date:{" "}
                            {new Date(
                              userData.staff[0].school_leader[0].date_removed
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {userData.parent && userData.parent[0] && (
                <>
                  <div className="mt-4">
                    <h3 className="font-semibold">Parent Details</h3>
                    <p>
                      Relationship Type: {userData.parent[0].relationship_type}
                    </p>
                  </div>
                </>
              )}

              {userData.admin && userData.admin[0] && (
                <>
                  <div className="mt-4">
                    <h3 className="font-semibold">Admin Details</h3>
                    <p>Admin Account</p>
                  </div>
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </Suspense>
  );
};

export default UserProfile;
