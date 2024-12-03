//render components based on condition
export const RenderContent = ({
  steps,
  currentStep,
}: {
  steps: Array<Record<string, string | React.JSX.Element>>;
  currentStep: string;
}) => {
  // render the component matching the condition
  return steps.find((step) => step.key === currentStep)?.value;
};
type Step = {
  key: string; // Or a more specific type like `RegistrationStep`
  label: string;
  value: React.JSX.Element;
};

type HandleStepChangeOptions = {
  steps: Step[];
  currentStep: string;
  targetStep: string;
  setCurrentStep: (step: string) => void;
  resetDataCallbacks?: {
    [stepIndex: number]: () => void;
  };
};

export const handleStepChange = ({
  steps,
  currentStep,
  targetStep,
  setCurrentStep,
  resetDataCallbacks = {},
}: HandleStepChangeOptions) => {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const targetStepIndex = steps.findIndex((s) => s.key === targetStep);

  // Allow navigation only to completed or current steps
  if (targetStepIndex <= currentStepIndex) {
    // Reset subsequent step data when moving back
    if (targetStepIndex < currentStepIndex) {
      Object.keys(resetDataCallbacks).forEach((key) => {
        const stepIndex = parseInt(key, 10);
        if (stepIndex > targetStepIndex) {
          resetDataCallbacks[stepIndex]?.();
        }
      });
    }
    setCurrentStep(targetStep);
  }
};
