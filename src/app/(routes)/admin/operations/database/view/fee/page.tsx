"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Update the fee details for a school
const FeeUpdate = () => {
  const [fees, set_fees] = useState<MyRecord[]>([
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

  return <DataTable records={fees} title="Fee Details" />;
};

export default FeeUpdate;
