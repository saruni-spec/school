import { flattenObjectIterative } from "@/lib/functions";
import { record, Student } from "../types/types";

//
const REGISTER_ROUTE = "http://localhost:3000/api/register";
//

// Client-side registration function with improved error handling
export const register = async ({
  data,
  model_name,
}: {
  data: Record<string, unknown>;
  model_name: string;
}) => {
  try {
    const response = await fetch(`${REGISTER_ROUTE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, model_name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Registration failed: ${model_name}`);
      throw new Error(errorData.error || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    alert(`Registration failed: ${model_name}`);
    console.error("Registration error:", error);
    throw error;
  }
};

//
// fetch data from th database given a model name and school id
export const fetchData = async (
  model_name: string,
  school_id: number | undefined,
  column_name?: string
) => {
  if (!school_id) {
    alert("Please select a school");
    throw new Error("School ID is required");
  }

  try {
    const queryParam = column_name || "school_id";
    const response = await fetch(
      `http://localhost:3000/api/fetch_record?table_name=${model_name}&${queryParam}=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch ${model_name}`);
      throw new Error(`Failed to fetch ${model_name}`);
    }
    return await response.json();
  } catch (error) {
    alert(`Failed to fetch ${model_name}`);
    console.error("Fetch error:", error);
    throw error;
  }
};
//
//fetch all data in a table
export const fetchTable = async (model_name: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/fetch?table=${model_name}`
    );
    if (!response.ok) {
      alert(`Failed to fetch ${model_name}`);
      throw new Error(`Failed to fetch ${model_name}`);
    }
    return await response.json();
  } catch (error) {
    alert(`Failed to fetch ${model_name}`);
    console.error("Fetch error:", error);
    throw error;
  }
};

//
export const getDataWithSchoolId = async (
  table_name: string,
  school_id: number | undefined
) => {
  if (!school_id) {
    alert("Please select a school");
    throw new Error("School ID is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/get/${table_name}?school_id=${school_id}`
  );
  if (!response.ok) {
    alert(`Failed to fetch ${table_name}`);
    throw new Error(`Failed to fetch ${table_name}`);
  }
  const data = await response.json();
  const flattened_data = data.map((item: record) =>
    flattenObjectIterative(item)
  );

  return flattened_data;
};

//
// get teacher specific details
export const getTeacherDetails = async (
  users_id: number
): Promise<record | null> => {
  try {
    const response = await fetch(`/api/teacher/${users_id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: record = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    console.log("Error fetching teacher details. Please try again.");
    return null;
  }
};

export const getStudentDetails = async (users_id: number) => {
  try {
    const response = await fetch(`/api/student/${users_id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: Student = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching student details:", error);
    console.log("Error fetching student details. Please try again.");
    return null;
  }
};
