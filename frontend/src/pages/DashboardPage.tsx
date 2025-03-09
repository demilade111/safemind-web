import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Users,
  MessageCircle,
  BookText,
  Video,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  const tiles = [
    {
      title: "Mood Tracker",
      icon: BarChart3,
      path: "/dashboard/mood-tracker",
      color: "bg-blue-100 text-blue-800",
      description: "Track your daily mood and emotions",
    },
    {
      title: "Journal",
      icon: BookOpen,
      path: "/dashboard/journal",
      color: "bg-green-100 text-green-800",
      description: "Express your thoughts and feelings",
    },
    {
      title: "Therapists",
      icon: Users,
      path: "/dashboard/therapists",
      color: "bg-purple-100 text-purple-800",
      description: "Connect with licensed professionals",
    },
    {
      title: "Communities",
      icon: MessageCircle,
      path: "/dashboard/communities",
      color: "bg-yellow-100 text-yellow-800",
      description: "Join supportive communities",
    },
    {
      title: "Resources",
      icon: BookText,
      path: "/dashboard/resources",
      color: "bg-red-100 text-red-800",
      description: "Explore mental health resources",
    },
    {
      title: "Video Sessions",
      icon: Video,
      path: "/dashboard/therapists",
      color: "bg-indigo-100 text-indigo-800",
      description: "Schedule and join video therapy sessions",
    },
  ];

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          This is your personal dashboard. Access all SafeMind features from
          here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, index) => (
          <Link
            key={index}
            to={tile.path}
            className="block hover:shadow-lg transition-shadow duration-200"
          >
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full ${tile.color} mb-4`}
              >
                <tile.icon size={24} />
              </div>
              <h2 className="text-xl font-semibold mb-2">{tile.title}</h2>
              <p className="text-gray-600">{tile.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Next Steps</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="bg-blue-600 rounded-full w-2 h-2 mr-2"></div>
            <span>
              Complete your profile to get personalized recommendations
            </span>
          </li>
          <li className="flex items-center">
            <div className="bg-blue-600 rounded-full w-2 h-2 mr-2"></div>
            <span>Log your mood daily for accurate tracking</span>
          </li>
          <li className="flex items-center">
            <div className="bg-blue-600 rounded-full w-2 h-2 mr-2"></div>
            <span>Browse available therapists and book your first session</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
