import React, { useEffect } from "react";
import {
  School,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard as Dashboard,
  X,
  Menu,
} from "lucide-react";
import { MenuLink } from "../types/types";
import { SchoolSelectionProps } from "./school_selection";
import { MyRecord } from "../types/types";
import {
  useLoadingState,
  useSidebarStore,
  useUser,
} from "../context/user_context";

// Define the interface for menu links

interface SideMenuProps {
  links: MenuLink[];
  schoolName?: string;
  logoUrl?: string;
  SchoolSelect?: React.FC<SchoolSelectionProps>;
}

const SideMenu: React.FC<SideMenuProps> = ({
  links,
  schoolName = "Soma Nasi",
  logoUrl,
  SchoolSelect,
}) => {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    setCollapsed,
  } = useSidebarStore();
  const { setSchool, school } = useUser();
  const { setLoading } = useLoadingState();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  const handleSchoolChange = (school: MyRecord) => {
    setSchool(school);
  };

  const handleRouteChange = (link: MenuLink) => {
    setLoading(true);
    if (window.innerWidth < 768) {
      toggleMobile();
    }
    link.action();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleMobile}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full z-40
          bg-gradient-to-b from-blue-200 to-blue-400
          text-white
          shadow-lg
          transition-all duration-300 ease-in-out
          md:translate-x-0
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header Section */}
        <div
          className={`
          flex items-center 
          ${isCollapsed ? "justify-center" : "justify-between"}
          p-4 border-b border-white/10
        `}
        >
          {(!isCollapsed || !isMobileOpen) && (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="School Logo"
                    className="w-10 h-10 rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shadow-md backdrop-blur-sm">
                    <School className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold leading-tight break-words text-gray-600/80">
                  {school ? (school.name as string) : schoolName}
                </h1>
              </div>
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            className="hidden md:flex items-center justify-center hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="text-white" />
            ) : (
              <ChevronLeft className="text-white" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow overflow-y-auto">
          {SchoolSelect && <SchoolSelect onSchoolSelect={handleSchoolChange} />}
          <ul className="py-2 px-2">
            {links.map((link, index) => (
              <li key={index}>
                <div
                  onClick={() => handleRouteChange(link)}
                  className={`
                    flex items-center p-3 space-x-3 
                    rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      link.active
                        ? "bg-white/10 text-white shadow-md backdrop-blur-sm"
                        : "text-gray-600/80 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <div className="flex-shrink-0">
                    {link.icon || <Dashboard className="w-5 h-5" />}
                  </div>
                  {!isCollapsed && (
                    <span className="truncate font-medium">{link.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10">
          <div
            onClick={() => {
              /* Add settings action */
            }}
            className={`
              flex items-center space-x-3 
              p-2 rounded-lg cursor-pointer
              text-gray-600/80 hover:bg-white/5 hover:text-white
              transition-colors duration-200
            `}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
