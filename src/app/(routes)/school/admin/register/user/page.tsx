"use client";
import {
  User,
  CompleteRegistration,
  UserTypeComponent,
} from "@/app/components/user_reg";
import SchoolSelection from "@/app/components/school_selection";
import React, { useState } from "react";
import UserTypeSelection from "@/app/components/select_user_type";
import { RenderProgressIndicator } from "@/app/components/progress_indicator";
import { RenderContent } from "@/app/components/conditional_render";
import { MyRecord, UserType, RegistrationStep } from "@/app/types/types";
//
//registration component
const UserRegistration = () => {
  //start with selecting the school
  const [currentStep, setCurrentStep] =
    useState<RegistrationStep>("school_selection");
  //select the user type
  const [user_type, set_user_type] = useState<UserType>();
  //save the user after registration
  const [user, set_user] = useState<MyRecord>();
  //save the school selected
  const [school, set_school] = useState<MyRecord>();
  //label the steps
  //save the school selected and move to user selection
  const handleSchoolSelect = (selectedSchool: MyRecord) => {
    set_school(selectedSchool);
    setCurrentStep("user_type_selection");
  };
  //save the user type selected and move to user details
  const handleUserTypeSelect = (selectedUserType: UserType) => {
    set_user_type(selectedUserType);
    setCurrentStep("user_details");
  };
  //save the user registered and move to additional details
  const handleUserRegistration = (registeredUser: MyRecord) => {
    set_user(registeredUser);
    setCurrentStep("additional_details");
  };
  //submit the additional details and complete the registration
  const handleAdditionalDetailsSubmit = () => {
    setCurrentStep("complete");
  };
  //steps and the component to be rendered by each step
  const steps: {
    key: RegistrationStep;
    label: string;
    value: React.JSX.Element;
  }[] = [
    {
      key: "school_selection",
      label: "Select School",
      value: <SchoolSelection onSchoolSelect={handleSchoolSelect} />,
    },
    {
      key: "user_type_selection",
      label: "Choose User Type",
      value: <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />,
    },
    {
      key: "user_details",
      label: "User Details",
      value: <User set_user={handleUserRegistration} />,
    },
    {
      key: "additional_details",
      label: "Additional Info",
      value: (
        <UserTypeComponent
          user_type={user_type}
          user={user}
          school={school}
          handleAdditionalDetailsSubmit={handleAdditionalDetailsSubmit}
        />
      ),
    },
    {
      key: "complete",
      label: "Complete",
      value: (
        <CompleteRegistration
          user_type={user_type}
          setCurrentStep={setCurrentStep}
          set_user={set_user}
          set_school={set_school}
          set_user_type={set_user_type}
        />
      ),
    },
  ];
  //**** */
  //handle the change of steps
  const handleStepChange = (step: RegistrationStep) => {
    console.log("step", step);
    const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
    const targetStepIndex = steps.findIndex((s) => s.key === step);

    // Allow navigation only to completed or current steps
    if (targetStepIndex <= currentStepIndex) {
      // Reset subsequent step data when moving back
      if (targetStepIndex < currentStepIndex) {
        if (targetStepIndex < 1) set_school(undefined);
        if (targetStepIndex < 2) set_user_type(undefined);
        if (targetStepIndex < 3) set_user(undefined);
      }
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-screen bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6">
          <RenderProgressIndicator
            steps={steps}
            currentStep={currentStep}
            handleStepChange={handleStepChange}
          />
          <RenderContent steps={steps} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
