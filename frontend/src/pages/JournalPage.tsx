import { useState } from "react";
import { Plus, BookOpen, Clock } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "My First Journal Entry",
      content:
        "Today was a productive day. I managed to accomplish several tasks on my to-do list and felt good about my progress.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      title: "Reflections on Therapy",
      content:
        "Had a great therapy session today. We discussed some strategies for managing anxiety in social situations.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(), // Simple ID generation
      title: "New Journal Entry",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setActiveEntry(newEntry);
  };

  const handleSaveEntry = () => {
    if (!activeEntry) return;

    const updatedEntry = {
      ...activeEntry,
      updatedAt: new Date().toISOString(),
    };

    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );

    // You would typically make an API call here to save the entry
    console.log("Saving entry:", updatedEntry);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={handleNewEntry}
        >
          <Plus size={18} className="mr-2" />
          New Entry
        </button>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Entries List */}
        <div className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden mr-4">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-600" />
              Your Entries
            </h2>
          </div>

          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeEntry?.id === entry.id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }`}
                onClick={() => setActiveEntry(entry)}
              >
                <h3 className="font-medium mb-1">{entry.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {entry.content}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal Editor */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          {activeEntry ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <input
                  type="text"
                  className="w-full text-xl font-semibold focus:outline-none"
                  value={activeEntry.title}
                  onChange={(e) => {
                    setActiveEntry({
                      ...activeEntry,
                      title: e.target.value,
                    });
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Last updated:{" "}
                  {new Date(activeEntry.updatedAt).toLocaleString()}
                </div>
              </div>

              <div className="flex-1 p-4">
                <textarea
                  className="w-full h-full p-2 focus:outline-none resize-none"
                  value={activeEntry.content}
                  onChange={(e) => {
                    setActiveEntry({
                      ...activeEntry,
                      content: e.target.value,
                    });
                  }}
                  placeholder="Write your journal entry here..."
                ></textarea>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={handleSaveEntry}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-blue-200" />
                <p>Select an entry or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
