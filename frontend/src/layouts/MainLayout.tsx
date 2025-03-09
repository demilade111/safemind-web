import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  BookOpen,
  Users,
  MessageCircle,
  BookText,
  UserCircle,
  LogOut,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, public: true },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      protected: true,
    },
    {
      path: "/dashboard/mood-tracker",
      label: "Mood Tracker",
      icon: BarChart3,
      protected: true,
    },
    {
      path: "/dashboard/journal",
      label: "Journal",
      icon: BookOpen,
      protected: true,
    },
    {
      path: "/dashboard/therapists",
      label: "Therapists",
      icon: Users,
      protected: true,
    },
    {
      path: "/dashboard/communities",
      label: "Communities",
      icon: MessageCircle,
      protected: true,
    },
    {
      path: "/dashboard/resources",
      label: "Resources",
      icon: BookText,
      protected: true,
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.public) return true;
    if (item.protected && user) return true;
    return false;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">SafeMind</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {filteredNavItems.map((item) => (
              <li key={item.path} className="px-2 py-1">
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Link
              to="/dashboard/profile"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/dashboard/profile")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <UserCircle size={18} className="mr-3" />
              <span>Profile</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center w-full p-3 mt-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
