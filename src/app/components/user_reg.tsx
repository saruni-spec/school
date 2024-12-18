"use client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { validateEmail } from "@/app/hooks/validation";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker } from "@/app/components/calendar";
import { Select } from "./select";
import { record, UserType, RegistrationStep, FieldType } from "../types/types";
import { role_type } from "@prisma/client";
import { useUser } from "../context/user_context";
import { SelectObject } from "./selectobejctitem";
import { getCurrentClassProgressions } from "../actions/actions";
import { useValidation } from "../hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
import { register } from "../api_functions/functions";
//the main component for user registration
export const User = ({
  set_user,
  role_id,
  school,
  user_type,
}: {
  set_user: (record: record) => void;
  role_id?: number;
  school?: record;
  user_type?: UserType;
}) => {
  // these are the variables that will be used to store the user details
  const first_name = useValidation({ type: FieldType.Text, required: true });
  const last_name = useValidation({ type: FieldType.Text, required: true });
  const email = useValidation({
    type: FieldType.Text,
    validators: [validateEmail],
  });
  const phone = useValidation({ type: FieldType.Text });
  const admission_number = useValidation({ type: FieldType.Text });

  // the function to handle the form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!school) {
        alert("Please select a school");
        return;
      }
      //check if all the fields are valid
      if (!validInputs([first_name, last_name, email, phone])) return;

      //
      //generate id code
      const full_year = new Date().getFullYear();
      const minutes = new Date().getMinutes();
      //
      const first_name_code = first_name.value.toString()[0];
      const last_name_code = last_name.value.toString()[0];
      //
      const id_code = `${first_name_code}${last_name_code}-${school.id}${role_id}${minutes}/${full_year}`;
      //
      //register the user
      const registered_user = await register({
        data: {
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          phone: phone.value,
          role_id: role_id,
          current_school: school.id,
          name: `${first_name.value} ${last_name.value}`,
          id_code: id_code,
          password: id_code,
        },
        model_name: "users",
      });

      let additional_user_details;
      //
      //save the user in the user specific table
      if (user_type === "STUDENT") {
        additional_user_details = await register({
          data: {
            user_id: registered_user.id,
            admission_number:
              admission_number.value === ""
                ? `${school.name[0]}${school.id}/${id_code}`
                : admission_number.value,
            student_code: `STU/${id_code}`,
          },
          model_name: "student",
        });
      } else {
        additional_user_details = await register({
          data: {
            user_id: registered_user.id,
            staff_code: `STF/${id_code}`,
          },
          model_name: "staff",
        });
      }

      if (user_type === "PRINCIPAL" || user_type === "VICE_PRINCIPAL") {
        const staff_code_prefix = user_type === "PRINCIPAL" ? "PRN" : "VPRN";
        additional_user_details = await register({
          data: {
            staff_id: registered_user.id,
            school_id: school.id,
            leader_code: `${staff_code_prefix}-${school.id}-${id_code}`,
            current_role: user_type,
          },
          model_name: "school_leader",
        });
      }

      set_user(additional_user_details);
    },
    [
      first_name,
      last_name,
      email,
      phone,
      set_user,
      role_id,
      school,
      user_type,
      admission_number,
    ]
  );
  return (
    <>
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
        {user_type === "STUDENT" && (
          <Input
            label="Admission Number"
            onChange={admission_number.handle_change}
            value={admission_number.value}
            error={admission_number.error}
          />
        )}
      </Form>
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
  const department_id = useValidation({ type: FieldType.Text });

  const role = useValidation({ type: FieldType.Text });
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
      if (!response.ok) {
        alert(`Failed to fetch ${department_table}`);
        throw new Error(`Failed to fetch ${department_table}`);
      }
      const departments = await response.json();
      setDepartments(departments);
    };

    getDepartments();
  }, [school_id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validInputs([department_id, role])) return;

      await register({
        data: {
          staff_id: staff_id,
          department_id: parseInt(department_id.value as string),
          current_role: role.value as role_type,
        },
        model_name: "department_staff",
      });

      if (onSubmit) {
        onSubmit();
      }
    },
    [staff_id, onSubmit, department_id, role]
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
  student_id,
  onSubmit,
}: {
  student_id: number;
  onSubmit?: () => void;
}) => {
  const [streams, setStreams] = useState<record[]>([]);
  const stream_id = useValidation({ type: FieldType.Text });
  const admission_date = useValidation({ type: FieldType.Date });
  const start_date = useValidation({
    type: FieldType.Date,
    minDate: admission_date.formatted_date as Date | undefined,
  });

  const { school_id } = useUser();
  //
  //get all the current classes
  const current_classes = useCallback(async () => {
    const classes = await getCurrentClassProgressions(school_id);
    //
    // Format the classes for the select input
    const flattenedClasses = classes.map((classProgression) => {
      return {
        id: classProgression.id,
        name: classProgression.stream
          ? classProgression.stream.name
          : undefined,
        grade_level:
          classProgression.stream && classProgression.stream.grade_level
            ? classProgression.stream.grade_level.level
            : undefined,
        start_date: classProgression.academic_year
          ? classProgression.academic_year.start_date
          : undefined,
      };
    });
    setStreams(flattenedClasses);
  }, [school_id]);

  useEffect(() => {
    current_classes();
  }, [school_id, current_classes]);

  //
  //handle stream selection
  //set the admission date and start date to the start date of the selected stream
  const streamSelecttion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    stream_id.handle_change(e);
    const selectedStream = streams.find(
      (stream) => stream.id === parseInt(e.target.value)
    );

    const selected_date =
      selectedStream?.start_date?.toString() || new Date().toISOString();
    admission_date.set_value(selected_date);
    start_date.set_value(selected_date);
  };

  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validInputs([stream_id, admission_date, start_date])) return;

    await register({
      data: {
        student_id: student_id,
        class_progress: parseInt(stream_id.value as string),
        admission_date: admission_date.formatted_date,
        start_date: start_date.formatted_date,
      },
      model_name: "student_class",
    });
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Form onSubmit={handleSubmit} submitButtonText="save Student Details">
      <Select
        options={streams}
        label={"Select Student's Current Class"}
        show_field={"name"}
        error={stream_id.error}
        placeholder={"Select Class"}
        value={stream_id.value}
        onChange={streamSelecttion}
      />
      <DatePicker
        label="Admission Date"
        value={admission_date.value}
        onChange={admission_date.handle_change}
        error={admission_date.error}
      />
      <DatePicker
        label="Start Date"
        value={start_date.value}
        onChange={start_date.handle_change}
        error={start_date.error}
      />
    </Form>
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
          {user_type === "STUDENT" && (
            <Student
              student_id={user.id}
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
}: {
  user_type: string | undefined;
  setCurrentStep: (step: RegistrationStep) => void;
  set_user: (user: record | undefined) => void;
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
// //
//   // table name to get the subjects available
//   const subject_table = "subject";
// const stream_table = "stream";
// //
// //get additional details for a teacher
// export const TeacherRegistration = ({
//   teacher_id, // the id of the teacher
//   onSubmit,
// }: {
//   teacher_id: string | number;
//   onSubmit?: () => void;
// }) => {
//   //
//   //get the role type of the teacher
//   const roleType = useValidation({ type: FieldType.Text });
//   const joinDate = useValidation({ type: FieldType.Date,required:true,maxDate:new Date()});
//   const qualifications = useValidation({ type: FieldType.Text });
//   const stream = useValidation({ type: FieldType.Text });
//   //
//   //validate the subject allocations
//   const subjectAllocations = ValidateMultipleOptions({
//     maxSelections: 5,
//     minSelections: 1,
//   });
//   //
//   //get the specialization of the teacher
//   const [specialization, set_specialization] =
//     useState<Record<string, string>>();
//   //
//   //save the streams
//   const [streams, setstreams] = useState<record[]>([]);

//   //
//   //save the subjects
//   const [subjects, setsubjects] = useState<record[]>([]);
//   //
//   //get the streams
//   //should get the streams without a vlas teacher
//   const getStreams = async () => {
//     const response = await fetchTable(stream_table);
//     setstreams(response);
//   };
//   //
//   //get the subjects
//   const getSubjects = async () => {
//     const response = await fetchTable(subject_table);
//     setsubjects(response);
//   };
//   //
//   //get the streams and subjects
//   useEffect(() => {
//     getStreams();
//     getSubjects();
//   }, []);
// //
//   // Handle form submission
//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
// //
//       // Validate inputs
//      if(!validInputs([roleType,joinDate,qualifications,stream])) return;
//       //validate the subject allocations
//       const isSubjectAllocationsValid = subjectAllocations.validate(
//         subjectAllocations.value
//       );
//       if (!isSubjectAllocationsValid) {
//         alert("Please fill in all required fields");
//         return;
//       }

//       try {
//         // Prepare submission data
//         const teacherData = {
//           role: {
//             type: roleType,
//             category: "TEACHING", // example category
//           },
//           staff: {
//             joinDate: new Date(joinDate.value),
//             qualifications: JSON.parse(qualifications.value || "{}"),
//           },
//           teacher: {
//             specialization,
//             subjectAllocations: subjectAllocations.value.map((allocation) => ({
//               subjectId: allocation.subjectId,
//               streamId: allocation.streamId,
//               academicYearId: allocation.academicYearId,
//             })),
//           },
//         };

//         // Submit to backend
//         const response = await fetch("/api/teachers", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(teacherData),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to register teacher");
//         }

//         // Reset form or navigate
//         alert("Teacher registered successfully");
//         if (onSubmit) onSubmit();
//       } catch (error) {
//         console.error("Error registering teacher:", error);
//         alert("Failed to register teacher");
//       }
//     },
//     [
//       roleType,
//       specialization,
//       joinDate,
//       qualifications,
//       subjectAllocations,
//       stream,
//       onSubmit,
//     ]
//   );

//   return (
//     <Form onSubmit={handleSubmit} submitButtonText="Add teacher information">
//       <MultiInput
//         label="Specialization"
//         placeholder="Enter any specializations the teacher has"
//         value={specialization}
//         onChange={set_specialization}
//         keyPlaceholder="Specialization"
//         valuePlaceholder="Specilized in"
//         validators={{
//           key: [validateKey],
//           value: [validateValue],
//         }}
//       />
//       <DatePicker
//         label="Join Date"
//         value={joinDate.value}
//         onChange={joinDate.handle_change}
//         error={joinDate.error || ""}
//       />

//       <MultiSelect
//         label="Subject Allocations"
//         selectedOptions={subjectAllocations.value}
//         options={subjects}
//         onSelectionChange={subjectAllocations.setSelectedOptions}
//         handleOptionToggle={subjectAllocations.handleOptionToggle}
//         handleRemoveOption={subjectAllocations.handleRemoveOption}
//       />

//       <Select
//         label="Class teacher of"
//         value={stream.value}
//         onChange={stream.handle_change}
//         error={stream.error}
//         placeholder="Select what class to assign the teacher"
//         options={streams}
//       />
//     </Form>
//   );
// };
