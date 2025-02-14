"use client";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { validateEmail } from "@/app/hooks/validation";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker } from "@/app/components/calendar";
import { Select } from "./select";
import {
  MyRecord,
  UserType,
  RegistrationStep,
  FieldType,
} from "../types/types";
import { domain_specific_roles } from "@prisma/client";
import { useUser } from "../context/user_context";
import { SelectObject } from "./selectobejctitem";
import { getCurrentClassProgressions } from "../actions/actions";
import { useValidation } from "../hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
import { register } from "../api_functions/functions";

//
//the main component for user registration
export const User = ({
  set_user,
  role_id,
  school,
  user_type,
}: {
  set_user: (record: MyRecord) => void;
  role_id?: number;
  school?: MyRecord;
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
          school_id: school.id,
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
            users_id: registered_user.id,
            admission_number:
              admission_number.value === ""
                ? `${school.name ? (school.name as string)[0] : ""}${
                    school.id
                  }/${id_code}`
                : admission_number.value,
            student_code: `STU/${id_code}`,
          },
          model_name: "student",
        });
      } else {
        const school_code_prefix =
          user_type === "PRINCIPAL"
            ? "PRN"
            : user_type === "TEACHER"
            ? "TR"
            : user_type === "VICE_PRINCIPAL"
            ? "VPRN"
            : user_type === "SCHOOL_ADMINISTRATOR"
            ? "ADM"
            : user_type === "SECRETARY"
            ? "SEC"
            : "STF";

        additional_user_details = await register({
          data: {
            users_id: registered_user.id,
            school_code: `${school_code_prefix}/${id_code}`,
          },
          model_name: "staff",
        });
      }

      set_user(additional_user_details);
      if (user_type === "STUDENT" || user_type === "PARENT") return;

      switch (user_type) {
        case "PRINCIPAL":
        case "VICE_PRINCIPAL":
        case "SCHOOL_ADMINISTRATOR": {
          break;
        }
        case "TEACHER": {
          await register({
            data: {
              staff_id: additional_user_details.id,
            },
            model_name: "teacher",
          });
          break;
        }
        default: {
          await register({
            data: {
              staff_id: additional_user_details.id,
            },
            model_name: "facility_staff",
          });
          break;
        }
      }
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
        <MyInput
          label="First Name"
          onChange={first_name.handle_change}
          value={first_name.value}
          error={first_name.error}
        />
        <MyInput
          label="Last Name"
          onChange={last_name.handle_change}
          value={last_name.value}
          error={last_name.error}
        />
        <MyInput
          type="email"
          label="Email"
          onChange={email.handle_change}
          value={email.value}
          error={email.error}
        />
        <MyInput
          label="Phone Number"
          onChange={phone.handle_change}
          value={phone.value}
          error={phone.error}
        />
        {user_type === "STUDENT" && (
          <MyInput
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
  staff_id, // the id of the user
}: {
  staff_id: number;
  onSubmit: () => void;
}) => {
  //
  //
  const academic_year = useValidation({
    type: FieldType.Text,
    required: true,
    initialValue: new Date().getFullYear().toString(),
  });
  const { school_id } = useUser();
  //
  //fetch the academic years

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validInputs([academic_year])) return;

      const response = await register({
        data: {
          school_id: school_id,
          year: academic_year.value,
        },
        model_name: "academic_year",
      });

      await register({
        data: {
          staff_id: staff_id,
          academic_year_id: response.id,
        },
        model_name: "school_leader",
      });

      if (onSubmit) onSubmit();
    },
    [onSubmit, staff_id, school_id, academic_year]
  );
  return (
    <Form
      title="School Admin Registration"
      onSubmit={handleSubmit}
      submitButtonText="Complete Registration"
    >
      <MyInput
        label="Academic Year"
        placeholder="Enter the academic year"
        value={academic_year.value}
        onChange={academic_year.handle_change}
        error={academic_year.error}
      />
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
  const [departments, setDepartments] = useState<MyRecord[]>([]);

  const getDepartments = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/api/fetch_record?table_name=${department_table}&school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch ${department_table}`);
      throw new Error(`Failed to fetch ${department_table}`);
    }
    const departments = await response.json();
    setDepartments(departments);
  }, [school_id]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validInputs([department_id, role])) return;

      console.log(department_id.value, role.value);

      const response = await fetch(
        `/api/staff/update?staff_id=${staff_id}&department_id=${department_id.value}&role=${role.value}`
      );

      if (!response.ok) {
        alert("Failed to update staff department");
        return;
      }

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
        options={domain_specific_roles}
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
  const [streams, setStreams] = useState<MyRecord[]>([]);
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
        class_progression_id: parseInt(stream_id.value as string),
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
  user: MyRecord | undefined;
  handleAdditionalDetailsSubmit: () => void;
}) => {
  const excludedRoles = [
    "SYSTEM_ADMINISTRATOR",
    "STUDENT",
    "PARENT",
    "AUDIT_OFFICER",
  ];

  return (
    <>
      {user && (
        <>
          {/* Fix the grouping of conditions */}
          {(user_type === "SCHOOL_ADMINISTRATOR" ||
            user_type === "PRINCIPAL" ||
            user_type === "VICE_PRINCIPAL") && (
            <SchoolAdmin
              staff_id={user.id}
              onSubmit={handleAdditionalDetailsSubmit}
            />
          )}

          {user_type === "STUDENT" && (
            <Student
              student_id={user.id}
              onSubmit={handleAdditionalDetailsSubmit}
            />
          )}

          {/* This condition should only run if none of the above match */}
          {user_type &&
            !excludedRoles.includes(user_type) &&
            user_type !== "SCHOOL_ADMINISTRATOR" &&
            user_type !== "PRINCIPAL" &&
            user_type !== "VICE_PRINCIPAL" && (
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
  set_user: (user: MyRecord | undefined) => void;
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
