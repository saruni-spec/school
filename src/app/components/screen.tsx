import React from "react";
import { LucideIcon } from "lucide-react";
import InspirationLoader from "./loading";
import { useLoadingState } from "../context/user_context";
import Link from "next/link";

// Define the type for grid item
interface GridItemProps {
  label: string;
  icon: LucideIcon;
  route: string;
  description?: string;
}

// Define the props for the Screen component
interface ScreenProps {
  items: GridItemProps[];
  title?: string;
  columns?: number;
  path_name?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  items,
  title = "Available Operations",
  columns = 3,
  path_name,
}) => {
  const { isLoading, setLoading } = useLoadingState();

  // Dynamically generate grid columns based on prop
  const gridColumns =
    {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[columns] || "grid-cols-3";

  const handleItemClick = () => {
    setLoading(true);

    // Use setTimeout to ensure a minimum loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Small delay to ensure loading state is visible
  };

  return (
    <>
      {isLoading && <InspirationLoader isLoading={isLoading} />}

      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className={`grid ${gridColumns} gap-4`}>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={
                  path_name
                    ? { pathname: path_name, query: { table: item.route } }
                    : item.route
                }
                onClick={handleItemClick}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center"
              >
                <Icon className="mb-2" />
                <h3 className="font-semibold">{item.label}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
