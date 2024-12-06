"use client";
import {
  User,
  UserTypeComponent,
  CompleteRegistration,
  RegistrationStep,
  UserType,
} from "@/app/components/user_reg";
import React, { useState } from "react";
import UserTypeSelection from "@/app/components/select_user_type";
import { RenderProgressIndicator } from "@/app/components/progress_indicator";
import {
  RenderContent,
  handleStepChange,
} from "@/app/components/conditional_render";
//
//registration component
const UserRegistration = () => {
  //start with selecting the school
  const [currentStep, setCurrentStep] = useState<RegistrationStep | string>(
    "user_type_selection"
  );
  //select the user type
  const [user_type, set_user_type] = useState<UserType>();
  //save the user after registration
  const [user, set_user] = useState<record>();
  //label the steps
  //save the user type selected and move to user details
  const handleUserTypeSelect = (selectedUserType: UserType) => {
    set_user_type(selectedUserType);
    setCurrentStep("user_details");
  };
  //save the user registered and move to additional details
  const handleUserRegistration = (registeredUser: record) => {
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
          set_user_type={set_user_type}
        />
      ),
    },
  ];
  const resetDataCallbacks = {
    1: () => set_user_type(undefined),
    2: () => set_user(undefined),
  };

  const handleStepChangeWrapper = (targetStep: string) => {
    handleStepChange({
      steps,
      currentStep,
      targetStep,
      setCurrentStep,
      resetDataCallbacks,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-screen bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6">
          <RenderProgressIndicator
            steps={steps}
            currentStep={currentStep}
            handleStepChange={() =>
              handleStepChange({
                steps,
                currentStep,
                targetStep,
                setCurrentStep,
                resetDataCallbacks,
              })
            }
          />
          <RenderContent steps={steps} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
