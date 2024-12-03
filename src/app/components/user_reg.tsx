"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { MultiInput } from "@/app/components/multi_input";
import Validation, {
  validateKey,
  validateValue,
  required,
} from "@/app/hooks/validation";
import React, { useCallback, useState } from "react";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
//
//the possible users that can be registred
export type UserType = "faculty" | "teacher" | "student" | "school_admin";
//
//steps for registration
export type RegistrationStep =
  | "user_type_selection"
  | "user_details"
  | "additional_details"
  | "complete"
  | "school_selection";
//
export const User = ({
  set_user,
}: {
  set_user: (record: Record<string, unknown>) => void;
}) => {
  const first_name = Validation("", []);
  const last_name = Validation("", []);
  const email = Validation("", []);
  const phone = Validation("", []);
  const address = Validation("", []);
  const role = Validation("", []);
  const password = Validation("", []);
  const date_of_birth = useDateValidation("", true, undefined, new Date());
  const [emergency_contacts, set_emergency_contacts] = useState<
    Record<string, string>
  >({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [
        first_name,
        last_name,
        email,
        phone,
        address,
        role,
        password,
        date_of_birth,
      ].every((field) => field.validate(field.value));
      if (!is_form_valid) return;

      console.log(date_of_birth.value);

      const result = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            phone: phone.value,
            address: address.value,
            password: password.value,
            date_of_birth: date_of_birth.formatted_date,
            emergency_contacts: emergency_contacts,
          },
          model_name: "users",
        }),
      });

      const user = await result.json();
      set_user(user);
    },
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      role,
      password,
      date_of_birth,
      emergency_contacts,
      set_user,
    ]
  );
  return (
    <Form onSubmit={handleSubmit} submitButtonText="Sign Up">
      <Input
        label="First Name"
        onChange={first_name.handle_change}
        value={first_name.value}
        error={first_name.error}
      />
      <Input
        label="Last Name"
        onChange={last_name.handle_change}
        value={last_name.value}
        error={last_name.error}
      />
      <Input
        label="Email"
        onChange={email.handle_change}
        value={email.value}
        error={email.error}
      />
      <Input
        label="Phone Number"
        onChange={phone.handle_change}
        value={phone.value}
        error={phone.error}
      />
      <DatePicker
        label="Date of Birth"
        value={date_of_birth.value}
        onChange={date_of_birth.handle_change}
        error={date_of_birth.error || ""}
      />
      <Input
        label="Address"
        onChange={address.handle_change}
        value={address.value}
        error={address.error}
      />

      <Input
        label="Password"
        onChange={password.handle_change}
        value={password.value}
        error={password.error}
      />
      <MultiInput
        label="Emergency Contacts"
        placeholder='Enter contact info (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={emergency_contacts}
        onChange={set_emergency_contacts}
        keyPlaceholder="Contact Type (email, phone)"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
    </Form>
  );
};

export const Teacher = ({
  staff_id,
  onSubmit,
}: {
  staff_id: string | unknown;
  onSubmit?: () => void;
}) => {
  const specializations = Validation("", []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!specializations.validate(specializations.value)) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { staff_id, specializations },
          model_name: "teacher",
        }),
      });

      if (onSubmit) {
        onSubmit();
      }
    },
    [specializations, staff_id, onSubmit]
  );
  return (
    <Form
      title="Teacher Registration"
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
    >
      <Input
        label="Specializations"
        placeholder="Enter any specializations"
        value={specializations.value}
        onChange={specializations.handle_change}
        error={specializations.error}
      />
    </Form>
  );
};

export const Student = ({
  user_id,
  onSubmit,
}: {
  user_id: string | unknown;
  onSubmit?: () => void;
}) => {
  //get the birth date od the student
  //the max possible date is today,and the field is required
  const date_of_birth = useDateValidation("", true, undefined, new Date());
  const [medical_info, set_medical_info] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [date_of_birth].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: { date_of_birth, medical_info, user_id },
          model_name: "student",
        }),
      });

      if (onSubmit) {
        onSubmit();
      }
    },
    [date_of_birth, medical_info, user_id, onSubmit]
  );
  return (
    <Form title="" onSubmit={handleSubmit} submitButtonText="">
      <DatePicker
        label="DOB"
        value={date_of_birth.value}
        onChange={date_of_birth.handle_change}
        error={date_of_birth.error || ""}
        required
      />
      <MultiInput
        label="Medical Information"
        placeholder="Enter Medical Information"
        value={medical_info}
        onChange={set_medical_info}
        keyPlaceholder="Contact Type (email, phone)"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
    </Form>
  );
};

export const Staff = ({
  school_id,
  department_id,
  user_id,
  onSubmit,
}: {
  school_id: string;
  department_id: string;
  user_id: string | unknown;
  onSubmit?: () => void;
}) => {
  const employment_status = Validation("", [required]);
  const join_date = useDateValidation(
    `${new Date()}`,
    false,
    undefined,
    new Date()
  );

  const [qualifications, set_qualifications] = useState<Record<string, string>>(
    {}
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const is_form_valid = [employment_status, join_date].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;
      await fetch("", {
        method: "POST",
        body: JSON.stringify({
          data: {
            school_id,
            department_id,
            user_id,
            employment_status,
            qualifications,
            join_date,
          },
          model_name: "staff",
        }),
      });
      if (onSubmit) {
        onSubmit();
      }
    },
    [
      employment_status,
      qualifications,
      join_date,
      school_id,
      department_id,
      user_id,
      onSubmit,
    ]
  );
  return (
    <Form title="" onSubmit={handleSubmit} submitButtonText="">
      <Input
        label="Current School Name"
        placeholder="Your Current School"
        required
        value={employment_status.value}
        onChange={employment_status.handle_change}
        error={employment_status.error}
      />
      <DatePicker
        label="Date Joining"
        value={join_date.value}
        onChange={join_date.handle_change}
        error={join_date.error || ""}
        required
      />
      <MultiInput
        label="Professional Qualifications"
        placeholder='Enter contact info (e.g., {"email": "info@example.com", "phone": "1234567890"})'
        value={qualifications}
        onChange={set_qualifications}
        keyPlaceholder="Contact Type (email, phone)"
        valuePlaceholder="Value"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
    </Form>
  );
};

//
//component to render the form for additional details based on user type
export const UserTypeComponent = ({
  user_type,
  user,
  school,
  handleAdditionalDetailsSubmit,
}: {
  user_type: string | undefined;
  user: Record<string, string | unknown> | undefined;
  school: Record<string, string | number> | undefined;
  handleAdditionalDetailsSubmit: () => void;
}) => {
  return (
    <>
      {user_type !== "student" && school && user && (
        <Staff
          user_id={user.user_id}
          department_id=""
          school_id={school.school_id as string}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "teacher" && user && (
        <Teacher
          staff_id={user.user_id}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "student" && user && (
        <Student
          user_id={user.user_id}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "school_admin" && user && <></>}
    </>
  );
};
//component to show after registration is complete
export const CompleteRegistration = ({
  user_type,
  setCurrentStep,
  set_user,
  set_school,
  set_user_type,
}: {
  user_type: string | undefined;
  setCurrentStep: (step: RegistrationStep) => void;
  set_user: (user: Record<string, string | unknown> | undefined) => void;
  set_school?: (school: Record<string, string | number> | undefined) => void;
  set_user_type: (user_type: UserType | undefined) => void;
}) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-green-600 mb-4 animate-pulse">
        Registration Complete!
      </h2>
      <p className="text-gray-700 mb-6">
        You have successfully registered as a {user_type}.
      </p>
      <button
        onClick={() => {
          // Reset to initial state or redirect
          setCurrentStep("user_details");
          set_user(undefined);
          if (set_school) {
            set_school(undefined);
          }
          set_user_type(undefined);
        }}
        className="
          px-6 py-3 
          bg-blue-500 text-white 
          rounded-lg 
          hover:bg-blue-600 
          transition duration-300 
          transform hover:scale-105 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-400
        "
      >
        Register Another User
      </button>
    </div>
  );
};
