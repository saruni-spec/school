import React from "react";

const Check_box = ({ item, onSelect }) => {
  return (
    <div
      key={item.id}
      onClick={() => onSelect(subject)}
      className={`
              cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out
              flex justify-between items-center
              ${
                selectedSubjects.some((s) => s.id === subject.id)
                  ? "bg-blue-100 border-blue-300 border"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
    >
      <div>
        <span className="font-medium text-gray-800">{subject.name}</span>
        <p className="text-xs text-gray-600">{subject.description}</p>
      </div>
      <input
        type="checkbox"
        checked={selectedSubjects.some((s) => s.id === subject.id)}
        onChange={() => {}} // Prevents react warning
        className="form-checkbox h-5 w-5 text-blue-600"
      />
    </div>
  );
};

export default Check_box;
