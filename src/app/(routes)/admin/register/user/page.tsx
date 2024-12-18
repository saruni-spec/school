"use client";
import {
  User,
  CompleteRegistration,
  UserTypeComponent,
} from "@/app/components/user_reg";
import React, { useState } from "react";
import UserTypeSelection from "@/app/components/select_user_type";
import { RenderProgressIndicator } from "@/app/components/progress_indicator";
import { RenderContent } from "@/app/components/conditional_render";
import {
  record,
  UserType,
  RegistrationStep,
  roles_id,
} from "@/app/types/types";
import { useUser } from "@/app/context/user_context";

//
//registration component
const UserRegistration = () => {
  //start with selecting the school
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    "user_type_selection"
  );
  //select the user type
  const [user_type, set_user_type] = useState<UserType>();
  //save the user after registration
  const [user, set_user] = useState<record>();
  //save the school selected
  const { school_id, school } = useUser();
  //label the steps
  //save the user type selected and move to user details
  const handleUserTypeSelect = (selectedUserType: UserType) => {
    set_user_type(selectedUserType);
    setCurrentStep("user_details");
  };
  //save the user registered and move to additional details
  const handleUserRegistration = (registeredUser: record) => {
    set_user(registeredUser);

    //
    //if the user is a principal or vice principal, move to complete registration
    if (user_type === "PRINCIPAL" || user_type === "VICE_PRINCIPAL") {
      setCurrentStep("complete");
      return;
    }
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
      label: user_type ?? "Choose User Type",
      value: <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />,
    },
    {
      key: "user_details",
      label: `ENTER ${user_type || "USER"} DETAILS`,
      value: (
        <User
          set_user={handleUserRegistration}
          role_id={user_type ? roles_id[user_type] : 26}
          school={school}
          user_type={user_type}
        />
      ),
    },
    {
      key: "additional_details",
      label: "ADDITIONAL INFO",
      value: (
        <UserTypeComponent
          user_type={user_type}
          user={user}
          handleAdditionalDetailsSubmit={handleAdditionalDetailsSubmit}
        />
      ),
    },
    {
      key: "complete",
      label: "COMPLETE",
      value: (
        <CompleteRegistration
          user_type={user_type}
          setCurrentStep={setCurrentStep}
          set_user={set_user}
        />
      ),
    },
  ];
  //**** */
  //handle the change of steps
  const handleStepChange = (step: RegistrationStep) => {
    const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
    const targetStepIndex = steps.findIndex((s) => s.key === step);

    // Allow navigation only to completed or current steps
    if (targetStepIndex <= currentStepIndex) {
      // Reset subsequent step data when moving back
      if (targetStepIndex < currentStepIndex) {
        if (targetStepIndex < 1) set_user_type(undefined);
        if (targetStepIndex < 2) set_user(undefined);
      }
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 ">
      <div className="w-full min-h-screen bg-white shadow-2xl rounded-xl ">
        <div className="p-6 h-full">
          {school_id && (
            <>
              <RenderProgressIndicator
                steps={steps}
                currentStep={currentStep}
                handleStepChange={handleStepChange}
              />
              <RenderContent steps={steps} currentStep={currentStep} />
            </>
          )}
          {!school_id && <p>Please Select a School</p>}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
