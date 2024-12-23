import React from "react";
import {
  BookOpen,
  Calendar,
  Bell,
  ClipboardList,
  GraduationCap,
  LineChart,
  Settings,
  School,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./components/button";

const HomePage = () => {
  // This would come from your auth system
  const isLoggedIn = false;

  const quickAccessFeatures = [
    {
      title: "About Us",
      description: "Learn more about our SomaNasi ",
      icon: ClipboardList,
      path: "/about",
    },
    {
      title: "Our Schools",
      description: "Schools in our network",
      icon: School,
      path: "/schools",
    },
    {
      title: "Academic Calendar",
      description: "Academic schedules, events, and important dates",
      icon: Calendar,
      path: "/calendar",
    },
    {
      title: "Announcements",
      description: "Stay updated with latest school news and notifications",
      icon: Bell,
      path: "/announcements",
    },
  ];

  const adminFeatures = [
    {
      title: "School Management",
      description: "Manage schools, departments, and classes",
      icon: GraduationCap,
      path: "/admin",
    },
    {
      title: "Portal",
      description: "Access grades, assignments, and learning materials",
      icon: BookOpen,
      path: "/login",
    },
    {
      title: "Reports",
      description: "Generate and view academic and administrative reports",
      icon: LineChart,
      path: "/reports",
    },

    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SomaNasi</h1>
          {!isLoggedIn && (
            <Link
              href={"/login"}
              className="px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to the Soma Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access all your educational resources, track progress, and stay
            connected with your school community in one centralized platform.
          </p>
        </div>

        <section className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Administrative Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {!isLoggedIn && (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Ready to Get Started?
            </h3>

            <Button>Login to Your Account</Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} SomaNasi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
