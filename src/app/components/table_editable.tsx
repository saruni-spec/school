import React, { useState } from "react";
import { MyRecord, RecordValue } from "../types/types";

interface DataTableProps {
  records: MyRecord[];
  title?: string;
  excludeColumns?: string[];
  onUpdate?: (
    recordId: number,
    field: string,
    value: RecordValue
  ) => Promise<void>;
}

const EditableDataTable: React.FC<DataTableProps> = ({
  records,
  title,
  excludeColumns = ["created_at", "updated_at", "deleted_at"],
  onUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<{
    recordId: number | null;
    field: string | null;
    value: RecordValue;
  }>({ recordId: null, field: null, value: null });

  if (!records.length) {
    return (
      <div className="text-center p-4 text-gray-500">No records found</div>
    );
  }

  // Get all unique keys from records excluding specified columns
  const columns = Array.from(
    new Set(
      records.flatMap((record) =>
        Object.keys(record).filter((key) => !excludeColumns.includes(key))
      )
    )
  );

  const formatValue = (value: MyRecord[keyof MyRecord]) => {
    if (value === null || value === undefined) {
      return "-";
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getTableAndField = (key: string) => {
    const parts = key.split(".");
    if (parts.length === 1) {
      return { table: null, field: parts[0] };
    }
    return {
      table: parts.slice(0, -1).join("_"),
      field: parts[parts.length - 1],
    };
  };

  const handleDoubleClick = (
    recordId: number,
    field: string,
    value: RecordValue
  ) => {
    const { table } = getTableAndField(field);
    // Only allow editing of fields that don't come from related tables
    if (!table) {
      setEditingCell({ recordId, field, value });
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!editingCell.recordId || !editingCell.field) return;

    if (e.key === "Enter") {
      try {
        await onUpdate?.(
          editingCell.recordId,
          editingCell.field,
          editingCell.value
        );
        setEditingCell({ recordId: null, field: null, value: null });
      } catch (error) {
        console.error("Failed to update:", error);
        // Optionally show error message to user
      }
    } else if (e.key === "Escape") {
      setEditingCell({ recordId: null, field: null, value: null });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCell((prev) => ({ ...prev, value: e.target.value }));
  };

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm">
      {title && (
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          {title}
        </h2>
      )}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.replace(/_/g, " ").replace(".", "_")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const isEditing =
                    editingCell.recordId === record.id &&
                    editingCell.field === column;
                  const { table } = getTableAndField(column);
                  const isEditable = !table;

                  return (
                    <td
                      key={`${record.id}-${column}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                        isEditable ? "cursor-pointer" : ""
                      }`}
                      onDoubleClick={() =>
                        handleDoubleClick(record.id, column, record[column])
                      }
                    >
                      {isEditing ? (
                        <input
                          title="Edit"
                          type="text"
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={
                            editingCell.value as
                              | string
                              | number
                              | readonly string[]
                          }
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      ) : (
                        formatValue(record[column])
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableDataTable;
//
// //handle simple changes in the department details
// const handleUpdate = async (
//   recordId: number,
//   field: string,
//   value: string | number | Date
// ) => {
//   try {
//     // Get table name from the current route or pass it as a prop
//     const modelName = "department"; // This should be dynamic based on your needs

//     const response = await fetch(`http://localhost:3000/api/update`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model_name: modelName,
//         data: {
//           where: { id: recordId },
//           data: { [field]: value },
//         },
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.details || "Failed to update record");
//     }
//     getDepartments();
//     return await response.json();
//   } catch (error) {
//     console.error("Error updating record:", error);
//     throw error;
//   }
// };
