// store/useUserStore.ts
import { create } from "zustand";
import { MyRecord, Principal, Student } from "@/app/types/types";
import { privilege_category, role_type } from "@prisma/client";

type User = {
  id: number;
  id_code: string;
  role: role_type;
  school: MyRecord;
  role_type: privilege_category;
  permissions: MyRecord[];
} & {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

interface UserState {
  user: User | undefined;
  school: MyRecord | undefined;
  school_id: number | undefined;
  roles: string | undefined;
  permissions: MyRecord[] | undefined;
  setUser: (user: User) => void;
  setSchool: (school: MyRecord) => void;
}

interface TeacherDetailsState {
  teacherDetails: MyRecord | undefined;
  setTeacherDetails: (teacherDetails: MyRecord) => void;
}

interface StudentDetailsState {
  studentDetails: Student | undefined;
  setStudentDetails: (studentDetails: Student) => void;
}

interface PricipalDetailsState {
  principalDetails: Principal | undefined;
  setPrincipalDetails: (principalDetails: Principal) => void;
}

interface SecretaryDetails {
  secretaryDetails: Secretary | undefined;
  setSecretaryDetails: (secretaryDetails: Secretary) => void;
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

  setSchool: (school: MyRecord) =>
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

export const useTeacherDetails = create<TeacherDetailsState>((set) => ({
  teacherDetails: undefined,

  setTeacherDetails: (teacherDetails: MyRecord) =>
    set(() => ({
      teacherDetails,
    })),
}));

export const useStudentDetails = create<StudentDetailsState>((set) => ({
  studentDetails: undefined,

  setStudentDetails: (studentDetails: Student) =>
    set(() => ({
      studentDetails,
    })),
}));

export const usePrincipalDetails = create<PricipalDetailsState>((set) => ({
  principalDetails: undefined,

  setPrincipalDetails: (principalDetails: Principal) =>
    set(() => ({
      principalDetails,
    })),
}));

export const useSecretaryDetails = create<SecretaryDetails>((set) => ({
  secretaryDetails: undefined,

  setSecretaryDetails: (secretaryDetails: Secretary) =>
    set(() => ({
      secretaryDetails,
    })),
}));

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));
