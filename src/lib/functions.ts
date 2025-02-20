//
//functions that are used in multiple components

import { FieldValidation, MyRecord } from "@/app/types/types";

//check if inputs are valid
export const validInputs = (inputs: FieldValidation[]): boolean => {
  return inputs.every((input) => input.validate(input.value as string));
};

export function flattenObjectIterative(obj: MyRecord): MyRecord {
  const result = {};
  const stack = [{ obj, parentKey: "" }];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) continue;
    const { obj: currentObj, parentKey } = item;

    for (const key in currentObj) {
      if (currentObj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (
          typeof currentObj[key] === "object" &&
          currentObj[key] !== null &&
          !Array.isArray(currentObj[key])
        ) {
          // @ts-expect-error dont know the type of currentObj[key]
          stack.push({ obj: currentObj[key], parentKey: newKey });
        } else {
          result[newKey] = currentObj[key];
        }
      }
    }
  }

  return <MyRecord>result;
}

export const convertToISOTime = (time: string) => {
  const placeholderDate = "2024-12-25"; // Use a default date
  return `${placeholderDate}T${time}:00.000Z`;
};
export const decodeISOTime = (isoString: string) => {
  // Use regex to extract the time portion (HH:MM)
  const match = isoString.match(/T(\d{2}:\d{2}):/);
  return match ? match[1] : null; // Return the extracted time or null if not a valid ISO string
};
