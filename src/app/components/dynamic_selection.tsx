"use client";
import React, { useState } from "react";
import { record } from "../types/types";
import CheckboxGroup from "./check_box_inputs";
import RadioInputs from "./radio";
import { SearchDb } from "./search_db";
import { useUser } from "../context/user_context";

//
//Allows the user to select a category and then select an item from that category
// In this example, the user can select a payee type (Individuals, Streams, Classes, Department, or School)
// and then select a specific payee from the chosen category.
interface DynamicSelectionProps {
  radioOptions: record[];
  getComponentForRadio: (selectedRadio: record) => {
    component: "checkbox" | "search" | "school" | "custom";
  };
  radioLabel?: string;
  radioIdentifier?: string;
  radioTitle?: string;
  radio_orientation?: "vertical" | "horizontal" | "grid";
  onSubmit: (radio: record, selectedItems: record) => void;
}

const DynamicSelection: React.FC<DynamicSelectionProps> = ({
  radioOptions,
  getComponentForRadio,
  radioLabel = "Select a category",
  radioIdentifier = "id",
  radioTitle,
  onSubmit,
  radio_orientation = "vertical",
}) => {
  const { school } = useUser();
  const [selectedRadio, setSelectedRadio] = useState<record | null>(null);
  const [selectedItems, setSelectedItems] = useState<record>();

  const handleRadioChange = (selected: record) => {
    setSelectedRadio(selected);
    setSelectedItems(undefined);
  };

  const handleSubmit = () => {
    if (selectedRadio && selectedItems) {
      onSubmit(selectedRadio, selectedItems);
    }
  };

  const renderDynamicComponent = () => {
    if (!selectedRadio) return null;

    const { component } = getComponentForRadio(selectedRadio);

    switch (component) {
      case "checkbox":
        return (
          <CheckboxGroup
            label="Select Payees"
            options={radioOptions}
            name="payee-group"
            identifier={selected_option === "grade_level" ? "level" : "name"}
            value={selectedItems.value}
            onChange={setSelectedItems}
            orientation="grid"
            error={selectedItems.error}
          />
        );
      case "search":
        return (
          <SearchDb
            table_name="user"
            search_field="name"
            display_fields={[
              "name",
              "first_name",
              "last_name",
              "date_of_birth",
              "email",
              "phone_number",
            ]}
            onSelect={(item: record) => setSelectedItems(item)}
            relationship={{ item: "student", field: "current_class" }}
          />
        );
      case "school": {
        setSelectedItems(school);
        // Render a school-specific component or use context
        return <p>Fee will b payed by all students</p>;
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <RadioInputs
          label={radioLabel}
          options={radioOptions}
          name="radio-group"
          value={
            selectedRadio
              ? (selectedRadio[radioIdentifier] as string)
              : undefined
          }
          onChange={handleRadioChange}
          identifier={radioIdentifier}
          title={radioTitle}
          orientation={radio_orientation}
        />
      </div>

      {selectedRadio && <div>{renderDynamicComponent()}</div>}

      <button
        onClick={handleSubmit}
        disabled={!selectedRadio || !selectedItems}
        className={`
          px-4 py-2 rounded 
          ${
            selectedRadio && selectedItems
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        Submit Selection
      </button>
    </div>
  );
};

export default DynamicSelection;
