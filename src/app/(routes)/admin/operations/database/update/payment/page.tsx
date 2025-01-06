"use client";
import { getDataWithSchoolId } from "@/app/api_functions/functions";
import EditableTable from "@/app/components/editable_table";
import { useUser } from "@/app/context/user_context";
import { MyRecord } from "@/app/types/types";
import React, { useCallback, useEffect, useState } from "react";
//
// Manage the payments made in the school
const Payment = () => {
  const [payments, set_payments] = useState<MyRecord[]>([
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

  return (
    <EditableTable
      records={payments}
      model_name="payment"
      title="Payments"
      school_id={school_id}
      onUpdate={getPayments}
    />
  );
};

export default Payment;
