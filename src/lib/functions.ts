//
//functions that are used in multiple components

import { FieldValidation, record } from "@/app/types/types";

//check if inputs are valid
export const validInputs = (inputs: FieldValidation[]): boolean => {
  return inputs.every((input) => input.validate(input.value as string));
};

export function flattenObjectWithReduce(obj: record, parentKey = "") {
  // Use Object.entries to get an array of key-value pairs from the input object.
  // Reduce iterates over this array and accumulates a flattened object.
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Create a new key by concatenating the parent key (if it exists) with the current key.
    // If there's no parent key, use the current key as is.
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // Check if the value is an object, and not null or an array.
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // If the value is a nested object, call the function recursively.
      // The new key becomes the parentKey for the nested object.
      // Use Object.assign to merge the results of the recursive call into the accumulator.
      Object.assign(acc, flattenObjectWithReduce(value, newKey));
    } else {
      // If the value is not a nested object (base case), add it to the accumulator.
      // Use the flattened key (`newKey`) as the key.
      acc[newKey] = value;
    }

    // Return the updated accumulator to the next iteration.
    return acc;
  }, {}); // Initialize the accumulator (`acc`) as an empty object.
}

export function flattenObjectIterative(obj: record) {
  const result = {};
  const stack = [{ obj, parentKey: "" }];

  while (stack.length > 0) {
    const { obj: currentObj, parentKey } = stack.pop();

    for (let key in currentObj) {
      if (currentObj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (
          typeof currentObj[key] === "object" &&
          currentObj[key] !== null &&
          !Array.isArray(currentObj[key])
        ) {
          stack.push({ obj: currentObj[key], parentKey: newKey });
        } else {
          result[newKey] = currentObj[key];
        }
      }
    }
  }

  return result;
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
