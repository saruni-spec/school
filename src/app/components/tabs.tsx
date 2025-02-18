import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({
  activeTab: "",
  setActiveTab: () => {},
});

export const Tabs = ({ defaultValue, children, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`flex gap-2 p-1 rounded-lg bg-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = "" }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 
      ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      } 
      ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className={`mt-2 ${className}`}>{children}</div>;
};
