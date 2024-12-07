"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { MultiInput } from "@/app/components/multi_input";
import { MultiSelect } from "@/app/components/multi_select";
import Validation, {
  validateKey,
  validateValue,
  required,
  ValidateMultipleOptions,
  validateEmail,
  validatePassword,
} from "@/app/hooks/validation";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { Select } from "./select";
import { record, UserType, RegistrationStep } from "../types/types";
import { role_type } from "@prisma/client";

//the main component for user registration
export const User = ({ set_user }: { set_user: (record: record) => void }) => {
  // these are the variables that will be used to store the user details
  const first_name = Validation("", []);
  const last_name = Validation("", []);
  const email = Validation("", [validateEmail]);
  const phone = Validation("", []);
  const address = Validation("", []);
  const role = Validation("", []);
  const password = Validation("", [validatePassword]);
  const date_of_birth = useDateValidation("", true, undefined, new Date());
  const [emergency_contacts, set_emergency_contacts] = useState<
    Record<string, string>
  >({});
  // the function to handle the form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      //check if all the fields are valid
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
      //send the data to the backend
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
        type="email"
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
        type="password"
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

//component to render the form for additional details based on user type
export const SchoolAdmin = ({
  onSubmit, // the function to handle the form submission
  user_id, // the id of the user
  school_id, // the id of the school
}: {
  user_id: string;
  onSubmit: () => void;
  school_id: string;
}) => {
  // for a school admin, im registering a staff member with the role as school admin
  // role is stores in the user table,so i need to get the role id for school admin
  // then update the user table with the role id
  // then register the staff member
  const role_type: role_type = "SCHOOL_ADMINISTRATOR";
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // update the user table with the role id
      // then register the staff member
      try {
        await fetch("/api/staff/add_role", {
          method: "POST",
          body: JSON.stringify({
            user_id,
            school_id,
            role_type: role_type,
          }),
        });

        if (onSubmit) {
          onSubmit();
        }
      } catch (error) {
        console.error(error);
        alert("Registration failed");
        return;
      }
    },
    [onSubmit, user_id, school_id]
  );
  return (
    <Form
      title="School Admin Registration"
      onSubmit={handleSubmit}
      submitButtonText="Complete"
    >
      <output>Admin Registered</output>
    </Form>
  );
};

//component to to add details about a teacher after registration
export const Teacher = ({
  staff_id, // the staff id of the teacher
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

//component to add details about a student after registration
export const Student = ({
  user_id, // the user id of the student/
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

      // Validate inputs
      const is_form_valid = [date_of_birth].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      // Submit to backend
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

//component to add details about a staff member after registration
export const Staff = ({
  school_id, // the id of the school
  department_id, // the id of the department
  user_id, // the user id of the user
  onSubmit,
}: {
  school_id: string;
  department_id: string;
  user_id: string | unknown;
  onSubmit?: () => void;
}) => {
  //get the employment status of the staff
  const employment_status = Validation("", [required]);
  //get the date of joining
  const join_date = useDateValidation(
    `${new Date()}`,
    false,
    undefined,
    new Date()
  );
  ///get the qualifications of the staff
  const [qualifications, set_qualifications] = useState<Record<string, string>>(
    {}
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate inputs
      const is_form_valid = [employment_status, join_date].every((field) =>
        field.validate(field.value)
      );
      if (!is_form_valid) return;

      // Submit to backend
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
  user: record | undefined;
  school: record | undefined;
  handleAdditionalDetailsSubmit: () => void;
}) => {
  return (
    <>
      {user_type === "faculty" && school && user && (
        <Staff
          user_id={user.user_id}
          department_id=""
          school_id={school.school_id as string}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "teacher" && user && (
        <TeacherRegistration
          teacher_id={user.user_id as string}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "student" && user && (
        <Student
          user_id={user.user_id}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
      {user_type === "school_admin" && user && school && (
        <SchoolAdmin
          user_id={user.id}
          school_id={school.id}
          onSubmit={handleAdditionalDetailsSubmit}
        />
      )}
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
  set_user: (user: record | undefined) => void;
  set_school?: (school: record | undefined) => void;
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

//get additional details for a teacher
export const TeacherRegistration = ({
  teacher_id, // the id of the teacher
  onSubmit,
}: {
  teacher_id: string | number;
  onSubmit?: () => void;
}) => {
  // table name to et the streams available
  const stream_table = "stream";
  //save the streams
  const [streams, setstreams] = useState<record[]>([]);
  // table name to get the subjects available
  const subject_table = "subject";
  //save the subjects
  const [subjects, setsubjects] = useState<record[]>([]);
  //get the role type of the teacher
  const roleType = Validation("", []);
  //get the specialization of the teacher
  const [specialization, set_specialization] =
    useState<Record<string, string>>();
  const joinDate = useDateValidation("", true, undefined, new Date());
  const qualifications = Validation("", []);
  const stream = Validation("", []);
  //validate the subject allocations
  const subjectAllocations = ValidateMultipleOptions({
    maxSelections: 5,
    minSelections: 1,
  });
  //get the streams
  //should get the streams without a vlas teacher
  const getStreams = async () => {
    const response = await fetch(`/api/fetch?table=${stream_table}`);
    const result = await response.json();
    setstreams(result.records);
  };
  //get the subjects
  const getSubjects = async () => {
    const response = await fetch(`/api/fetch?table=${subject_table}`);
    const result = await response.json();
    setsubjects(result.records);
  };
  //get the streams and subjects
  useEffect(() => {
    getStreams();
    getSubjects();
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate inputs
      const isFormValid = [roleType, joinDate, qualifications, stream].every(
        (field) => field.validate(field.value)
      );
      //validate the subject allocations
      const isSubjectAllocationsValid = subjectAllocations.validate(
        subjectAllocations.value
      );
      if (!isFormValid || !isSubjectAllocationsValid) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        // Prepare submission data
        const teacherData = {
          role: {
            type: roleType,
            category: "TEACHING", // example category
          },
          staff: {
            joinDate: new Date(joinDate.value),
            qualifications: JSON.parse(qualifications.value || "{}"),
          },
          teacher: {
            specialization,
            subjectAllocations: subjectAllocations.value.map((allocation) => ({
              subjectId: allocation.subjectId,
              streamId: allocation.streamId,
              academicYearId: allocation.academicYearId,
            })),
          },
        };

        // Submit to backend
        const response = await fetch("/api/teachers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teacherData),
        });

        if (!response.ok) {
          throw new Error("Failed to register teacher");
        }

        // Reset form or navigate
        alert("Teacher registered successfully");
        if (onSubmit) onSubmit();
      } catch (error) {
        console.error("Error registering teacher:", error);
        alert("Failed to register teacher");
      }
    },
    [
      roleType,
      specialization,
      joinDate,
      qualifications,
      subjectAllocations,
      stream,
      onSubmit,
    ]
  );

  return (
    <Form onSubmit={handleSubmit} submitButtonText="Add teacher information">
      <MultiInput
        label="Specialization"
        placeholder="Enter any specializations the teacher has"
        value={specialization}
        onChange={set_specialization}
        keyPlaceholder="Specialization"
        valuePlaceholder="Specilized in"
        validators={{
          key: [validateKey],
          value: [validateValue],
        }}
      />
      <DatePicker
        label="Join Date"
        value={joinDate.value}
        onChange={joinDate.handle_change}
        error={joinDate.error || ""}
      />

      <MultiSelect
        label="Subject Allocations"
        selectedOptions={subjectAllocations.value}
        options={subjects}
        onSelectionChange={subjectAllocations.setSelectedOptions}
        handleOptionToggle={subjectAllocations.handleOptionToggle}
        handleRemoveOption={subjectAllocations.handleRemoveOption}
      />

      <Select
        label="Class teacher of"
        value={stream.value}
        onChange={stream.handle_change}
        error={stream.error}
        placeholder="Select what class to assign the teacher"
        options={streams}
      />
    </Form>
  );
};
