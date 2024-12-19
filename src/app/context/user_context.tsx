// store/useUserStore.ts
import { create } from "zustand";
import { record } from "@/app/types/types";

interface User {
  id: number;
  school: record;
  role: string;
  role_type: string;
  permissions: record[];
}

interface UserState {
  user: User | undefined;
  school: record | undefined;
  school_id: number | undefined;
  roles: string | undefined;
  permissions: record[] | undefined;
  setUser: (user: User) => void;
  setSchool: (school: record) => void;
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
