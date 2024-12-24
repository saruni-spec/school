"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Manage the payments made in the school
const Payment = () => {
  const [payments, set_payments] = useState<record[]>([
    {
      id: 34567898765,
      amount: "",
      "over payment": "",
      "payment date": "",
      "payment method": "",
      status: "",
      "reference number": "",
      "users.id code": "",
      "users.email": "",
      "users.phone": "",
    },
  ]);
  const { school_id } = useUser();
  //
  //get the payments made in a school
  const getPayments = useCallback(async () => {
    const data = await getDataWithSchoolId("payment", school_id);

    if (data.length === 0) return;

    set_payments(data);
  }, [school_id]);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  return <DataTable records={payments} title="Payments" />;
};

export default Payment;