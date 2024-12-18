//
//functions that are used in multiple components

import { FieldValidation } from "@/app/types/types";

//check if inputs are valid
export const validInputs = (inputs: FieldValidation[]): boolean => {
  return inputs.every((input) => input.validate(input.value as string));
};
