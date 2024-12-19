"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

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
    const response = await fetch(
      `http://localhost:3000/api/fee/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch fees`);
      throw new Error(`Failed to fetch fees`);
    }
    const data = await response.json();
    console.log(data);
    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) {
      return;
    }
    set_fees(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (school_id) {
      getFeeDetails();
    }
  }, [school_id, getFeeDetails]);

  return <DataTable records={fees} title="Fee Details" />;
};

export default FeeUpdate;
