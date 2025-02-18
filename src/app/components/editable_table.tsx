import React, { useState } from "react";
import { BaseValue, MyRecord, RecordValue } from "../types/types";

interface DataTableProps {
  records: MyRecord[];
  title?: string;
  excludeColumns?: string[];
  model_name: string;
  school_id?: number;
  onUpdate?: () => void;
}

const EditableTable: React.FC<DataTableProps> = ({
  records,
  title,
  excludeColumns = ["created_at", "updated_at", "deleted_at"],
  model_name,
  school_id,
  onUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<{
    recordId: number | null;
    field: string | null;
    value: RecordValue;
    relatedRecords?: MyRecord[];
  }>({ recordId: null, field: null, value: null });

  if (!records.length) {
    return (
      <div className="text-center p-4 text-gray-500">No records found</div>
    );
  }

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

  const getRelatedRecords = async (tableName: string) => {
    try {
      const response = await fetch(
        `/api/related_records?table=${tableName}&school_id=${school_id}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch related records for ${tableName}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching related records for ${tableName}:`, error);
      return [];
    }
  };

  const updateDatabase = async (
    recordId: number,
    field: string,
    value: string | number | Date,
    model_name: string
  ) => {
    try {
      const response = await fetch(`/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_name: model_name,
          data: {
            where: { id: recordId },
            data: { [field]: value },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to update record");
      }
      if (onUpdate) {
        onUpdate();
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating record:", error);
      throw error;
    }
  };

  const getTableAndField = (key: string) => {
    const parts = key.split(".");
    if (parts.length === 1) {
      return { table: null, field: parts[0], isRelational: false };
    }
    return {
      table: parts[0],
      field: parts.slice(1).join("."),
      isRelational: true,
    };
  };

  const handleDoubleClick = async (
    recordId: number,
    field: string,
    value: RecordValue
  ) => {
    const { table, isRelational } = getTableAndField(field);

    if (isRelational && getRelatedRecords) {
      // Load related records for dropdown
      try {
        const relatedRecords = await getRelatedRecords(table);
        setEditingCell({
          recordId,
          field,
          value,
          relatedRecords,
        });
      } catch (error) {
        console.error("Failed to load related records:", error);
      }
    } else {
      setEditingCell({ recordId, field, value });
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingCell.recordId || !editingCell.field) return;

    const target = e.target as HTMLElement;

    if (
      e.key === "Enter" ||
      (e.type === "change" && target.tagName === "SELECT")
    ) {
      try {
        const { table, isRelational } = getTableAndField(editingCell.field);

        if (isRelational) {
          // Convert the relational field to its ID field
          const idField = `${table}_id`;
          await updateDatabase?.(
            editingCell.recordId,
            idField,
            Number(editingCell.value),
            model_name
          );
        } else {
          await updateDatabase?.(
            editingCell.recordId,
            editingCell.field,
            editingCell.value as BaseValue,
            model_name
          );
        }
        setEditingCell({ recordId: null, field: null, value: null });
      } catch (error) {
        console.error("Failed to update:", error);
      }
    } else if (e.key === "Escape") {
      setEditingCell({ recordId: null, field: null, value: null });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditingCell((prev) => ({ ...prev, value: e.target.value }));
  };

  const getCellStyle = (field: string) => {
    const { isRelational } = getTableAndField(field);
    return `px-6 py-4 whitespace-nowrap text-sm cursor-pointer ${
      isRelational ? "bg-blue-50" : ""
    }`;
  };

  const renderEditingCell = (field: string) => {
    const { isRelational } = getTableAndField(field);

    if (isRelational && editingCell.relatedRecords) {
      return (
        <select
          title="Select..."
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editingCell.value as string | number | readonly string[]}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        >
          <option value="">Select...</option>
          {editingCell.relatedRecords.map((record) => (
            <option key={record.id} value={record.id}>
              {(record.name as string) ||
                (record.year as string) ||
                (record.level as string) ||
                record.id}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        title="Enter to save, Esc to cancel"
        type="text"
        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editingCell.value as string | number | readonly string[]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
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
                  {column.replace(/_/g, " ").replace(".", ": ")}
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

                  return (
                    <td
                      key={`${record.id}-${column}`}
                      className={getCellStyle(column)}
                      onDoubleClick={() =>
                        handleDoubleClick(record.id, column, record[column])
                      }
                    >
                      {isEditing
                        ? renderEditingCell(column)
                        : formatValue(record[column])}
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

export default EditableTable;
