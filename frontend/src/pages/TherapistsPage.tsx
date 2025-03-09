import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Video } from "lucide-react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  bio: string;
  imageUrl?: string;
}

interface Session {
  id: string;
  therapistId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [therapistsResponse, sessionsResponse] = await Promise.all([
          api.get("/therapists"),
          api.get("/sessions"),
        ]);

        setTherapists(therapistsResponse.data);
        setSessions(sessionsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUpcomingSessions = () => {
    return sessions
      .filter(
        (session) =>
          session.status === "scheduled" &&
          new Date(session.startTime) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Therapists</h1>

      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>

        {getUpcomingSessions().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getUpcomingSessions().map((session) => {
              const therapist = therapists.find(
                (t) => t.id === session.therapistId
              );
              const sessionDate = new Date(session.startTime);

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {therapist?.name || "Unknown Therapist"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {sessionDate.toLocaleDateString()} at{" "}
                        {sessionDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {new Date() >= sessionDate &&
                      new Date() < new Date(session.endTime) && (
                        <Link
                          to={`/video-call/${session.id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center text-sm"
                        >
                          <Video size={16} className="mr-1" />
                          Join Now
                        </Link>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">
            No upcoming sessions. Schedule one with a therapist below.
          </p>
        )}
      </div>

      {/* Therapists List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Therapists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {therapist.imageUrl ? (
                      <img
                        src={therapist.imageUrl}
                        alt={therapist.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-semibold text-lg">
                        {therapist.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{therapist.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {therapist.specialties.join(", ")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                  {therapist.bio}
                </p>

                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/therapists/${therapist.id}`}
                    className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/dashboard/schedule/${therapist.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center"
                  >
                    <Calendar size={16} className="mr-1" />
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapistsPage;
