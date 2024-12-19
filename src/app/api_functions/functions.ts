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
