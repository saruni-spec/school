"use client";
import DataTable from "@/app/components/data_table";
import { useUser } from "@/app/context/user_context";
import { record } from "@/app/types/types";
import { flattenObjectIterative } from "@/lib/functions";
import React, { useCallback, useEffect, useState } from "react";

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
    const response = await fetch(
      `http://localhost:3000/api/payment/get?school_id=${school_id}`
    );
    if (!response.ok) {
      alert(`Failed to fetch payments`);
      throw new Error(`Failed to fetch payments`);
    }
    const data = await response.json();

    const flattened_data = data.map((item: record) =>
      flattenObjectIterative(item)
    );
    if (flattened_data.length === 0) return;
    set_payments(flattened_data);
  }, [school_id]);

  useEffect(() => {
    if (!school_id) return;
    getPayments();
  }, [getPayments, school_id]);

  return <DataTable records={payments} title="Payments" />;
};

export default Payment;
