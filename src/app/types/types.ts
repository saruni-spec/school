//all the types that are used in the app

import { role_type } from "@prisma/client";

//all my database tables are of this type
//an object with key value pairs where key is a string and value is a string,number or json
//each table has an id field for identification
export type record = Record<
  string,
  string | number | Record<string, string | number>
> & { id: string };

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
