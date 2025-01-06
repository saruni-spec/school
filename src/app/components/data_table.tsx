import React from "react";
import { MyRecord } from "../types/types";

interface DataTableProps {
  records: MyRecord[];
  title?: string;
  excludeColumns?: string[];
}

const DataTable: React.FC<DataTableProps> = ({
  records,
  title,
  excludeColumns = ["created_at", "updated_at", "deleted_at"],
}) => {
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
                  {column.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${record.id}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {formatValue(record[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
