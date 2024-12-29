// store/useUserStore.ts
import { create } from "zustand";
import { record, Student } from "@/app/types/types";
import { privilege_category, role_type } from "@prisma/client";

type User = {
  id: number;
  id_code: string;
  role: role_type;
  school: record;
  role_type: privilege_category;
  permissions: record[];
} & {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

interface UserState {
  user: User | undefined;
  school: record | undefined;
  school_id: number | undefined;
  roles: string | undefined;
  permissions: record[] | undefined;
  setUser: (user: User) => void;
  setSchool: (school: record) => void;
}

interface teacherDetailsState {
  teacherDetails: record | undefined;
  setTeacherDetails: (teacherDetails: record) => void;
}

interface studentDetailsState {
  studentDetails: Student | undefined;
  setStudentDetails: (studentDetails: Student) => void;
}

export const useUser = create<UserState>((set) => ({
  user: undefined,
  school: undefined,
  school_id: undefined,
  roles: undefined,
  permissions: undefined,

  setUser: (user: User) =>
    set(() => ({
      user,
      school: user.school,
      school_id: user.school.id,
      roles: user.role_type,
      permissions: user.permissions,
    })),

  setSchool: (school: record) =>
    set(() => ({
      school,
      school_id: school.id,
    })),
}));

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingState = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export const useTeacherDetails = create<teacherDetailsState>((set) => ({
  teacherDetails: undefined,

  setTeacherDetails: (teacherDetails: record) =>
    set(() => ({
      teacherDetails,
    })),
}));

export const useStudentDetails = create<studentDetailsState>((set) => ({
  studentDetails: undefined,

  setStudentDetails: (studentDetails: Student) =>
    set(() => ({
      studentDetails,
    })),
}));
