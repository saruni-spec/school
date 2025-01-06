//all the types that are used in the app

import { role_type } from "@prisma/client";

//all my database tables are of this type
//an object with key value pairs where key is a string and value is a string,number or json
//each table has an id field for identification
type BaseValue = string | number | Date | null | undefined;

export type generic_record = {
  [key: string]: generic_record | BaseValue | generic_record[];
};

type RecordValue = BaseValue | { [key: string]: RecordValue } | RecordValue[];

export type MyRecord = {
  id: number;
  [key: string]: RecordValue;
};

export type InputField = {
  value: string | number;
  error: string | null;
  handle_change: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  validate: (inputValue: string | number) => boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handle_value_change: (newValue: string | number) => void;
};

export type Student = {
  id: number;
  student_code: string;
  admission_number: string;
  users: {
    id: number;
    id_code: string;
  };
  student_class: {
    class_progression: {
      id: number;
      name: string;
      teacher: {
        staff: {
          users: {
            name: string;
            id_code: string;
          };
        };
      };
      stream_id: number;
    };
  }[];
};

export type Principal = {
  id: number;
  staff: {
    school_code: string | null;
  } | null;
} | null;

export type DateField = {
  value: string;
  error: string | null;
  handle_change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate: (inputValue: string) => boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handle_value_change: (newValue: string) => void;
  formatted_date: Date | null;
  set_value: React.Dispatch<React.SetStateAction<string>>;
};

// Enum to specify the type of field
export enum FieldType {
  Text,
  Number,
  Date,
}
export type DateFormat = "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY";
// Generic validator function type
type ValidatorFunction = (value: string | number) => string | null;

// Unified field configuration
export interface FieldConfig {
  type: FieldType;
  initialValue?: string | number;
  required?: boolean;
  validators?: ValidatorFunction[];

  // Date-specific options
  minDate?: Date;
  maxDate?: Date;
  date_format?: DateFormat;
}

export interface FieldValidation {
  value: string | number;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  validate: (inputValue: string) => boolean;
  handle_change: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handle_value_change: (newValue: string) => void;
  formatted_date?: Date | null;
  set_value: React.Dispatch<React.SetStateAction<string | number>>;
}

//
//the possible users that can be registred
export type UserType = role_type;

////
//
export const roles_id = {
  SYSTEM_ADMINISTRATOR: 1,
  PRINCIPAL: 2,
  VICE_PRINCIPAL: 3,
  SCHOOL_ADMINISTRATOR: 4,
  HEAD_OF_DEPARTMENT: 5,
  ACADEMIC_REGISTRAR: 6,
  EXAM_CONTROLLER: 7,
  CURRICULUM_COORDINATOR: 8,
  TEACHER: 9,
  CLASS_TEACHER: 10,
  FACULTY_MEMBER: 11,
  ADMINISTRATIVE_STAFF: 12,
  SECRETARY: 13,
  FACILITY_MANAGER: 14,
  FINANCIAL_OFFICER: 15,
  HUMAN_RESOURCES_MANAGER: 16,
  EVENT_COORDINATOR: 17,
  LIBRARIAN: 18,
  ASSISTANT_LIBRARIAN: 19,
  TECHNOLOGY_SUPPORT: 20,
  SECURITY_PERSONNEL: 21,
  ADMISSIONS_OFFICER: 22,
  COUNSELOR: 23,
  MEDICAL_STAFF: 24,
  CHEF: 25,
  STUDENT: 26,
  PARENT: 27,
  AUDIT_OFFICER: 28,
};

export const grade_levels = {
  PRE_PRIMARY_1: 1,
  PRE_PRIMARY_2: 2,
  GRADE_1: 3,
  GRADE_2: 4,
  GRADE_3: 5,
  GRADE_4: 6,
  GRADE_5: 7,
  GRADE_6: 8,
  GRADE_7: 9,
  GRADE_8: 10,
  GRADE_9: 11,
  GRADE_10: 12,
  GRADE_11: 13,
  GRADE_12: 14,
};

export const gradesInEachLevel = {
  PRE_PRIMARY: [grade_levels.PRE_PRIMARY_1, grade_levels.PRE_PRIMARY_2],
  LOWER_PRIMARY: [
    grade_levels.GRADE_1,
    grade_levels.GRADE_2,
    grade_levels.GRADE_3,
  ],
  UPPER_PRIMARY: [
    grade_levels.GRADE_4,
    grade_levels.GRADE_5,
    grade_levels.GRADE_6,
  ],
  LOWER_SECONDARY: [
    grade_levels.GRADE_7,
    grade_levels.GRADE_8,
    grade_levels.GRADE_9,
  ],
  UPPER_SECONDARY: [
    grade_levels.GRADE_10,
    grade_levels.GRADE_11,
    grade_levels.GRADE_12,
  ],
};
//
//steps for registration
export type RegistrationStep =
  | "user_type_selection"
  | "user_details"
  | "additional_details"
  | "complete";

export interface MenuLink {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  active?: boolean;
}
