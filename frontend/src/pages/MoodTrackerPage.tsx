import { useState } from "react";
import { LineChart, Calendar } from "lucide-react";

const MoodTrackerPage = () => {
  const [activeView, setActiveView] = useState<"calendar" | "chart">(
    "calendar"
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mood Tracker</h1>
        <div className="bg-white border rounded-lg flex overflow-hidden">
          <button
            className={`px-4 py-2 flex items-center ${
              activeView === "calendar"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveView("calendar")}
          >
            <Calendar size={18} className="mr-2" />
            Calendar
          </button>
          <button
            className={`px-4 py-2 flex items-center ${
              activeView === "chart"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveView("chart")}
          >
            <LineChart size={18} className="mr-2" />
            Chart
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeView === "calendar" ? (
          <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              Mood calendar will be implemented here
            </p>
          </div>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Mood chart will be implemented here</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Log Your Mood</h2>

        <div className="mb-6">
          <h3 className="font-medium mb-3">How are you feeling today?</h3>
          <div className="flex justify-between max-w-xl">
            {["Very Bad", "Bad", "Neutral", "Good", "Very Good"].map(
              (mood, index) => (
                <button key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      [
                        "bg-red-100",
                        "bg-orange-100",
                        "bg-yellow-100",
                        "bg-green-100",
                        "bg-emerald-100",
                      ][index]
                    }`}
                  >
                    <span className="text-2xl">
                      {["😢", "🙁", "😐", "🙂", "😄"][index]}
                    </span>
                  </div>
                  <span className="text-sm">{mood}</span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Notes</h3>
          <textarea
            className="w-full border rounded-lg p-3 h-32"
            placeholder="What's on your mind today?"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage;
