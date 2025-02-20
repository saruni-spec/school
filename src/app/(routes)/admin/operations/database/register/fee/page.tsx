"use client";
import React, { Suspense, useState } from "react";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { ListValidation, requiredList } from "@/app/hooks/validation";
import { DatePicker } from "@/app/components/calendar";
import { useUser } from "@/app/context/user_context";
import { SelectList } from "@/app/components/select_list";
import { fee_type_enum, installment_types } from "@prisma/client";
import { FieldType, generic_record, MyRecord } from "@/app/types/types";
import RadioInputs from "@/app/components/radio";
import CheckboxGroup from "@/app/components/check_box_inputs";
import { getGradeLevels } from "@/app/actions/actions";
import { fetchData, register } from "@/app/api_functions/functions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { validInputs } from "@/lib/functions";
import { LoadingSpinner } from "@/app/components/loading";
//
//fees an be for individuals,streams,classes,department or the entire school
const possibe_payees = [
  { name: "School" },
  { name: "Department" },
  { name: "Streams" },
  { name: "Grades" },
];

const payee_fields = {
  Department: "department_id",
  Streams: "stream_id",
  Grades: "stream_id",
};

const department_table = "department";
const stream_table = "stream";

const Fee = () => {
  const amount = useValidation({ type: FieldType.Text, required: true });
  const fee_for = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text });
  const due_date = useValidation({
    type: FieldType.Date,
    required: true,
    minDate: new Date(),
  });
  const installment_type = useValidation({
    type: FieldType.Text,
    required: true,
  });
  const payees = ListValidation([], { listValidator: requiredList });
  //
  //
  const [selectedRadio, setSelectedRadio] = useState<generic_record>({
    name: "School",
  });
  const [options, setOptions] = useState<MyRecord[]>([]);

  const fee_types: string[] = Object.keys(fee_type_enum);
  const installment_options = Object.keys(installment_types);

  const { school_id } = useUser();

  //
  //fetch departments in the school
  const fetchDepartments = async () => {
    const response = await fetchData(department_table, school_id);
    setOptions(response);
  };
  //
  //fetch grade level (server action)
  const fetchGradeLevels = async () => {
    const response = await getGradeLevels(school_id);
    setOptions(response);
  };
  //
  //fetch departments in the school
  const fetchStreams = async () => {
    const response = await fetchData(stream_table, school_id);
    setOptions(response as MyRecord[]);
  };

  //
  //fetch payees based on the selected radio
  const handleRadioChange = (selected: generic_record) => {
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

    if (
      !validInputs([amount, fee_for, description, due_date, installment_type])
    )
      return;

    if (!payees.validate) return;

    const data = await register({
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
    });
    const payee_list = payees.list as MyRecord[];
    //
    //add a each payee to the fee_payee table
    const fee_id = data.id;
    switch (selectedRadio.name) {
      case "School":
        await register({
          data: {
            fee_id,
            whole_school: true,
          },
          model_name: "fee_payee",
        });
        break;

      case "Grades": {
        const streams: MyRecord[] = await fetchData(stream_table, school_id);

        // Get all the streams in the selected grades
        const selected_streams = streams.filter((stream) =>
          payee_list.some((payee) => payee.id === stream.grade_level_id)
        );

        await Promise.all(
          selected_streams.map(async (stream) => {
            await register({
              data: {
                fee_id,
                stream_id: stream.id,
              },
              model_name: "fee_payee",
            });
          })
        );
        break;
      }

      default: {
        const payee_field = payee_fields[selectedRadio.name as string];

        await Promise.all(
          payee_list.map(async (payee) => {
            await register({
              data: {
                fee_id,
                [payee_field]: payee.id,
              },
              model_name: "fee_payee",
            });
          })
        );
        break;
      }
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
        <MyInput
          label="Description"
          placeholder="Enter Fee Description"
          value={description.value}
          onChange={description.handle_change}
          error={description.error}
        />
        <MyInput
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
            value={
              selectedRadio ? (selectedRadio["name"] as string) : undefined
            }
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
                value={payees.list as MyRecord[]}
                error={payees.error}
                value_field={selectedRadio.name === "Grades" ? "level" : "name"}
                orientation="grid"
                gridColumns={2}
              />
            </>
          )}
        </div>
      </Form>
    </Suspense>
  );
};

export default Fee;
