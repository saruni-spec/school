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

const HomePage = () => {
  const isLoggedIn = false;

  const quickAccessFeatures = [
    {
      title: "About Us",
      description: "Learn more about our SomaNasi",
      icon: ClipboardList,
      path: "/about",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Our Schools",
      description: "Schools in our network",
      icon: School,
      path: "/schools",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Academic Calendar",
      description: "Academic schedules, events, and important dates",
      icon: Calendar,
      path: "/calendar",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Announcements",
      description: "Stay updated with latest school news and notifications",
      icon: Bell,
      path: "/announcements",
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  const adminFeatures = [
    {
      title: "School Management",
      description: "Manage schools, departments, and classes",
      icon: GraduationCap,
      path: "/admin",
      color: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Portal",
      description: "Access grades, assignments, and learning materials",
      icon: BookOpen,
      path: "/login",
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Reports",
      description: "Generate and view academic and administrative reports",
      icon: LineChart,
      path: "/reports",
      color: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: Settings,
      path: "/settings",
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header
        className={`bg-white shadow-md fixed w-full top-0 z-50 transition-all duration-300 $`}
      >
        <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center relative">
          <h1 className="text-4xl font-bold text-gray-900 font-display">
            <span className="text-blue-600">Soma</span>Nasi
          </h1>
          {!isLoggedIn && (
            <Link
              href="/login"
              className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16 transform hover:scale-[1.01] transition-transform">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Soma Hub
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access all your educational resources, track progress, and stay
            connected with your school community in one centralized platform.
          </p>
        </div>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickAccessFeatures.map((feature) => (
              <Link href={feature.path} key={feature.title}>
                <div
                  className={`rounded-xl p-6 ${feature.color} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`p-3 rounded-full ${feature.iconColor} bg-white`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Administrative Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adminFeatures.map((feature) => (
              <Link href={feature.path} key={feature.title}>
                <div
                  className={`rounded-xl p-6 ${feature.color} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`p-3 rounded-full ${feature.iconColor} bg-white`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                Join Our Educational Community
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover a world of learning opportunities, connect with fellow
                students, and access resources that will help you succeed in
                your academic journey.
              </p>
              {!isLoggedIn && (
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/learn-more"
                    className="inline-block px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-blue-600 font-bold text-2xl mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Students Enrolled</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-purple-600 font-bold text-2xl mb-2">
                  50+
                </div>
                <div className="text-gray-600">Expert Teachers</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-green-600 font-bold text-2xl mb-2">
                  100%
                </div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-orange-600 font-bold text-2xl mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} SomaNasi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
