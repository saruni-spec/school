//all the types that are used in the app

//all my database tables are of this type
//an object with key value pairs where key is a string and value is a string,number or json
//each table has an id field for identification
export type record = Record<
  string,
  string | number | Record<string, string | number>
> & { id: string };

//
//the possible users that can be registred
export type UserType =
  | "faculty"
  | "teacher"
  | "student"
  | "school_admin"
  | "global";
//
//steps for registration
export type RegistrationStep =
  | "user_type_selection"
  | "user_details"
  | "additional_details"
  | "complete"
  | "school_selection";

export interface MenuLink {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  active?: boolean;
}
