import React from "react";

const Table = ({ children, className = "", ...props }) => {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full border-collapse border-spacing-0 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = "", ...props }) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = "", ...props }) => {
  return (
    <tbody
      className={`bg-white divide-y divide-gray-200 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = "", ...props }) => {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td className={`px-4 py-4 text-sm text-gray-900 ${className}`} {...props}>
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
