import React, { useState } from "react";
import {
  School,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard as Dashboard,
} from "lucide-react";
import { MenuLink } from "../types/types";
// Define the interface for menu links

interface SideMenuProps {
  links: MenuLink[];
  schoolName?: string;
  logoUrl?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({
  links,
  schoolName = "Multi-School System",
  logoUrl,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`
      fixed left-0 top-0 h-full 
      bg-gray-800 text-white 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-64"}
      flex flex-col
    `}
    >
      {/* Header Section */}
      <div
        className={`
        flex items-center 
        ${isCollapsed ? "justify-center" : "justify-between"}
        p-4 border-b border-gray-700
      `}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="School Logo"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <School className="w-10 h-10" />
            )}
            <span className="text-lg font-bold truncate max-w-[200px]">
              {schoolName}
            </span>
          </div>
        )}

        <button
          onClick={toggleMenu}
          className="hover:bg-gray-700 p-2 rounded-full transition"
          aria-label={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="py-2">
          {links.map((link, index) => (
            <li
              key={index}
              className={`
                group cursor-pointer 
                ${link.active ? "bg-gray-700" : "hover:bg-gray-700"}
                transition duration-200
              `}
            >
              <div
                onClick={link.action}
                className="flex items-center p-3 space-x-3"
              >
                {link.icon || <Dashboard className="w-5 h-5" />}
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-700">
        <div
          onClick={() => {
            /* Add settings action */
          }}
          className={`
            flex items-center space-x-3 
            hover:bg-gray-700 p-2 rounded 
            cursor-pointer transition
          `}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

// // Example Usage:
// export const MultiSchoolSideMenuExample = () => {
//   const menuLinks: MenuLink[] = [
//     {
//       label: "Dashboard",
//       icon: <Dashboard />,
//       action: () => console.log("Dashboard clicked"),
//       active: true
//     },
//     {
//       label: "Students",
//       icon: <People />,
//       action: () => console.log("Students clicked")
//     },
//     // Add more links as needed
//   ];

//   return (
//     <SideMenu
//       links={menuLinks}
//       schoolName="Springfield High School"
//       logoUrl="/path/to/school/logo.png"
//     />
//   );
// }
