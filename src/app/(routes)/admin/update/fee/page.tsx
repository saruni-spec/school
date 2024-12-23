"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the fee details for a school
const FeeUpdate = () => {
  const [fees, set_fees] = useState<record[]>([
    {
      id: 35243658575,
      amount: "",
      description: "",
      "fee for": "",
      installments: "",
      "due date": "",
      "school leader": "",
      "fee payee": "[]",
    },
  ]);

  const { school_id } = useUser();
  //
  //get the fee details for a school
  const getFeeDetails = useCallback(async () => {
    const data = await getDataWithSchoolId("fee", school_id);

    if (data.length === 0) return;

    set_fees(data);
  }, [school_id]);

  useEffect(() => {
    getFeeDetails();
  }, [getFeeDetails]);

  return (
    <EditableTable
      records={fees}
      model_name="fee"
      title="Fees Table"
      school_id={school_id}
      onUpdate={getFeeDetails}
    />
  );
};

export default FeeUpdate;
