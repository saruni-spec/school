//the user context stores all user data for use during a session.
//make the user context a client component
"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { record } from "@/app/types/types";

interface User {
  id: number;
  school: record;
  role: string;
  role_type: string;
  permissions: record[];
}

interface UserContextType {
  user: User | undefined;
  setUser: (user: User) => void;
  school: record | undefined;
  school_id: number | undefined;
  setSchool: (school: record) => void;
  roles: string | undefined;
  permissions: record[] | undefined;
}
//
//create the user context variable
const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  school: undefined,
  school_id: undefined,
  setSchool: () => {},
  roles: undefined,
  permissions: undefined,
});
//
//export the user context allowing it to take children as arguments to allow it to wrap around the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  //user,school and permissions are the user context variables
  const [user, setUser] = useState<User>();
  const [school, setSchool] = useState<record>();
  const [school_id, setSchoolId] = useState<number>();
  const [roles, setRole] = useState<string>();
  const [permissions, setPermissions] = useState<record[]>();

  //
  //get the role,school and permissions of the user when a user is set
  useEffect(() => {
    if (user) {
      setSchool(user.school);
      setSchoolId(user.school.id);
      setRole(user.role_type);
      setPermissions(user.permissions);
    }
  }, [user]);

  //
  //update school id when the school is set
  useEffect(() => {
    if (school) {
      setSchoolId(school.id);
    }
  }, [school]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        school,
        school_id,
        setSchool,
        roles,
        permissions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
