"use client";
import React, { useState } from "react";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import Validation, {
  ListValidation,
  required,
  requiredList,
} from "@/app/hooks/validation";
import { DatePicker, useDateValidation } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { SelectList } from "@/app/components/select_list";
import { fee_type_enum, installment_types } from "@prisma/client";
import { record } from "@/app/types/types";
import RadioInputs from "@/app/components/radio";
import CheckboxGroup from "@/app/components/check_box_inputs";
import { getGradeLevels, getStreams } from "@/app/actions/actions";

//
//fees an be for individuals,streams,classes,department or the entire school
const possibe_payees = [
  { name: "School" },
  { name: "Department" },
  { name: "Streams" },
  { name: "Grades" },
];

const payee_fields = {
  Department: "for_department",
  Streams: "for_stream",
  Grades: "for_stream",
};

const department_table = "department";

const Fee = () => {
  const amount = Validation("", [required]);
  const fee_for = Validation("", [required]);
  const description = Validation("", []);
  const due_date = useDateValidation("", true, new Date());
  const installment_type = Validation("", [required]);

  const payees = ListValidation([], { listValidator: requiredList });

  const [selectedRadio, setSelectedRadio] = useState<
    Record<string, string | number | Record<string, string | number>>
  >({ name: "School" });
  const [options, setOptions] = useState<record[]>([]);

  const fee_types: string[] = Object.keys(fee_type_enum);
  const installment_options = Object.keys(installment_types);

  const { school_id } = useUser();

  //
  //fetch departments in the school
  const fetchDepartments = async () => {
    const response = await fetch(
      `http://localhost:3000/api/fetch_record?table_name=${department_table}&school_id=${school_id}`
    );
    const data = await response.json();
    setOptions(data);
  };

  //
  //fetch grade level
  const fetchGradeLevels = async () => {
    const response = await getGradeLevels(school_id);
    setOptions(response);
  };

  //
  //fetch streams
  //
  //fetch departments in the school
  const fetchStreams = async () => {
    const response = await getStreams(school_id);
    setOptions(response as record[]);
  };

  //
  //fetch payees based on the selected radio
  const handleRadioChange = (
    selected: Record<string, string | number | Record<string, string | number>>
  ) => {
    setSelectedRadio(selected);
    switch (selected.name) {
      case "Streams":
        fetchStreams();
        break;
      case "Grades":
        fetchGradeLevels();
        break;
      case "Department":
        fetchDepartments();
        break;
      case "School":
        setOptions([]);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const is_form_valid = [
      amount,
      fee_for,
      description,
      due_date,
      installment_type,
    ].every((input) => input.validate(input.value));

    if (!is_form_valid) return;

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        data: {
          amount: amount.value,
          fee_for: fee_for.value,
          description: description.value,
          due_date: due_date.formatted_date,
          installments: installment_type.value,
          school_id,
          code: `${fee_for.value}-${installment_type.value}-${school_id}`,
        },
        model_name: "fee",
      }),
    });
    if (!response.ok) {
      alert("An error occured");
      return;
    }
    //
    //add a each payee to the fee_payee table
    const data = await response.json();
    const fee_id = data.id;
    switch (selectedRadio.name) {
      case "School":
        await fetch("http://localhost:3000/api/register", {
          method: "POST",
          body: JSON.stringify({
            data: {
              fee_id,
              whole_school: true,
            },
            model_name: "fee_payee",
          }),
        });
        break;

      case "Grades": {
        const streams = await getStreams(school_id);

        // Get all the streams in the selected grades
        const selected_streams = streams.filter((stream) =>
          payees.list.some((payee) => payee.id === stream.grade_level_id)
        );

        await Promise.all(
          selected_streams.map(async (stream) => {
            await fetch("http://localhost:3000/api/register", {
              method: "POST",
              body: JSON.stringify({
                data: {
                  fee_id,
                  for_stream: stream.id,
                },
                model_name: "fee_payee",
              }),
            });
          })
        );
        break;
      }

      default: {
        const payee_field = payee_fields[selectedRadio.name];

        await Promise.all(
          payees.list.map(async (payee) => {
            await fetch("http://localhost:3000/api/register", {
              method: "POST",
              body: JSON.stringify({
                data: {
                  fee_id,
                  [payee_field]: payee.id,
                },
                model_name: "fee_payee",
              }),
            });
          })
        );
        break;
      }
    }
  };

  return (
    <Form
      title="Register Fee"
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <SelectList
        label="Fee Type"
        options={fee_types}
        value={fee_for.value}
        onChange={fee_for.handle_change}
        error={fee_for.error}
      />
      <Input
        label="Description"
        placeholder="Enter Fee Description"
        value={description.value}
        onChange={description.handle_change}
        error={description.error}
      />
      <Input
        label="Amount"
        placeholder="Enter Fee Amount"
        required
        type="number"
        value={amount.value}
        onChange={amount.handle_change}
        error={amount.error}
      />
      <DatePicker
        label="Due Date"
        placeholder="Enter Due Date (Optional)"
        type="date"
        value={due_date.value}
        onChange={due_date.handle_change}
        error={due_date.error}
      />
      <SelectList
        label="Installment Type"
        options={installment_options}
        value={installment_type.value}
        onChange={installment_type.handle_change}
        error={installment_type.error}
      />
      <div>
        <RadioInputs
          label="Who does the fee apply to?"
          options={possibe_payees}
          id_field="name"
          name="radio-group"
          value={selectedRadio ? (selectedRadio["name"] as string) : undefined}
          onChange={handleRadioChange}
          value_field="name"
          orientation="grid"
          gridColumns={2}
        />
        {selectedRadio && (
          <>
            <CheckboxGroup
              label={"Select Payees"}
              options={options}
              onChange={payees.setList}
              value={payees.list}
              error={payees.error}
              value_field={selectedRadio.name === "Grades" ? "level" : "name"}
              orientation="grid"
              gridColumns={2}
            />
          </>
        )}
      </div>
    </Form>
  );
};

export default Fee;
