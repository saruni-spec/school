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
} from "@/app/hooks/validation";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { Select } from "./select";
import { record, UserType, RegistrationStep } from "../types/types";
import { role_type } from "@prisma/client";
import { DetailsDisplay } from "./display";
import { ArrowRight } from "lucide-react";
import { SelectList } from "./select_list";
import { useUser } from "../context/user_context";
import { SelectObject } from "./selectobejctitem";

//the main component for user registration
export const User = ({
  set_user,
  role_id,
  school_id,
  user_type,
}: {
  set_user: (record: record) => void;
  role_id?: number;
  school_id?: number;
  user_type?: UserType;
}) => {
  // these are the variables that will be used to store the user details
  const first_name = Validation("", []);
  const last_name = Validation("", []);
  const email = Validation("", [validateEmail]);
  const phone = Validation("", []);

  // the function to handle the form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      //check if all the fields are valid
      const is_form_valid = [first_name, last_name, email, phone].every(
        (field) => field.validate(field.value)
      );
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
            role_id: role_id,
            current_school: school_id,
            name: `${first_name.value} ${last_name.value}`,
            password: `${first_name.value}${last_name.value}@${school_id}`,
          },
          model_name: "users",
        }),
      });

      const user = await result.json();
      let response;
      //
      //save the user in the user specific table
      console.log("user type", user_type);
      if (user_type === "STUDENT") {
        response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          body: JSON.stringify({
            data: {
              user_id: user.id,
            },
            model_name: "student",
          }),
        });
      } else {
        response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          body: JSON.stringify({
            data: {
              user_id: user.id,
            },
            model_name: "staff",
          }),
        });
      }
      console.log("sttaf reg", response);
      if (!response.ok) {
        alert("Registration failed");
        return;
      }

      if (user_type === "PRINCIPAL" || user_type === "VICE_PRINCIPAL") {
        const staff_code_prefix = user_type === "PRINCIPAL" ? "PRN" : "VPRN";
        response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          body: JSON.stringify({
            data: {
              staff_id: user.id,
              school_id: school_id,
              leader_code: `${staff_code_prefix}-${school_id}-${user.id}`,
              current_role: user_type,
            },
            model_name: "school_leader",
          }),
        });
      }

      const user_details = await response.json();
      set_user(user_details);
    },
    [
      first_name,
      last_name,
      email,
      phone,
      set_user,
      role_id,
      school_id,
      user_type,
    ]
  );
  return (
    <>
      {school_id && (
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
        </Form>
      )}
      {!school_id && <>Please select a school</>}
    </>
  );
};

//component to render the form for additional details based on user type
export const SchoolAdmin = ({
  onSubmit, // the function to handle the form submission
  user_id, // the id of the user
}: {
  user_id: number;
  onSubmit: () => void;
}) => {
  // for a school admin, im registering a staff member with the role as school admin
  // role is stores in the user table,so i need to get the role id for school admin
  // then update the user table with the role id
  // then register the staff member
  const role_type: role_type = "SCHOOL_ADMINISTRATOR";

  const { school_id } = useUser();

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
export const Staff = ({
  staff_id, // the staff id of the teacher
  onSubmit,
}: {
  staff_id: number;
  onSubmit?: () => void;
}) => {
  const department_table = "department";
  const department_id = Validation("", []);

  const role = Validation("", []);
  const { school_id } = useUser();

  //
  //get all the roles

  //
  //get the departments in the school
  const [departments, setDepartments] = useState<record[]>([]);

  useEffect(() => {
    const getDepartments = async () => {
      const response = await fetch(
        `http://localhost:3000/api/fetch_record?table_name=${department_table}&school_id=${school_id}`
      );
      const departments = await response.json();
      setDepartments(departments);
    };

    getDepartments();
  }, [school_id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const if_form_valid = [department_id, role].every((field) =>
        field.validate(field.value)
      );

      if (!if_form_valid) return;

      const staff_code = `STF-${school_id}-${department_id.value}-${staff_id}`;

      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify({
          data: {
            staff_id: staff_id,
            department_id: parseInt(department_id.value as string),
            current_role: role.value as role_type,
            staff_code,
          },
          model_name: "department_staff",
        }),
      });

      if (onSubmit) {
        onSubmit();
      }
    },
    [staff_id, onSubmit, school_id, department_id, role]
  );
  return (
    <Form
      title="Staff Registration"
      onSubmit={handleSubmit}
      submitButtonText="Complete registration"
    >
      <Select
        label="Department"
        value={department_id.value}
        onChange={department_id.handle_change}
        error={department_id.error}
        placeholder="Select Department"
        options={departments}
      />
      <SelectObject
        label="Role"
        value={role.value}
        onChange={role.handle_change}
        error={role.error}
        placeholder="Select Role"
        options={role_type}
      />
    </Form>
  );
};

//component to add details about a student after registration
export const Student = ({
  user, // the user id of the student/
  onSubmit,
}: {
  user: record;
  onSubmit?: () => void;
}) => {
  const handleSubmit = async () => {
    // Validate inputs
    const is_form_valid = [date_of_birth].every((field) =>
      field.validate(field.value)
    );
    if (!is_form_valid) return;

    // Submit to backend
    await fetch("", {
      method: "POST",
      body: JSON.stringify({
        data: { role, school_id },
        model_name: "student",
      }),
    });

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <DetailsDisplay
      details={user}
      actionButton={{
        label: "Proceed",
        onClick: handleSubmit,
        icon: ArrowRight,
        variant: "primary",
      }}
    />
  );
};

//
//component to render the form for additional details based on user type
export const UserTypeComponent = ({
  user_type,
  user,

  handleAdditionalDetailsSubmit,
}: {
  user_type: UserType | undefined;
  user: record | undefined;

  handleAdditionalDetailsSubmit: () => void;
}) => {
  const excludedRoles = [
    "SYSTEM_ADMINISTRATOR",
    "PRINCIPAL",
    "VICE_PRINCIPAL",
    "SCHOOL_ADMINISTRATOR",
    "STUDENT",
    "PARENT",
    "AUDIT_OFFICER",
  ];
  return (
    <>
      {user && (
        <>
          {user_type === "SCHOOL_ADMINISTRATOR" && (
            <SchoolAdmin
              user_id={user.id}
              onSubmit={handleAdditionalDetailsSubmit}
            />
          )}

          {user_type && !excludedRoles.includes(user_type) && (
            <Staff
              staff_id={user.id}
              onSubmit={handleAdditionalDetailsSubmit}
            />
          )}
        </>
      )}
    </>
  );
};
//component to show after registration is complete
export const CompleteRegistration = ({
  user_type,
  setCurrentStep,
  set_user,
  set_user_type,
}: {
  user_type: string | undefined;
  setCurrentStep: (step: RegistrationStep) => void;
  set_user: (user: record | undefined) => void;
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
