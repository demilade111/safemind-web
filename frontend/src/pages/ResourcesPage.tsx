import { useState } from "react";
import { BookText, Video, File, Search, Tag } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "pdf";
  tags: string[];
  url: string;
  createdAt: string;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "Understanding Anxiety Disorders",
      description:
        "A comprehensive guide to different types of anxiety disorders, their symptoms, and treatment options.",
      type: "article",
      tags: ["anxiety", "mental health", "education"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "2",
      title: "5-Minute Mindfulness Meditation",
      description:
        "A quick guided meditation practice to help you reduce stress and improve focus.",
      type: "video",
      tags: ["meditation", "mindfulness", "stress"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "3",
      title: "Cognitive Behavioral Therapy Workbook",
      description:
        "Practical exercises and worksheets based on CBT principles to help manage negative thought patterns.",
      type: "pdf",
      tags: ["CBT", "therapy", "workbook"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "4",
      title: "Sleep Hygiene: Best Practices",
      description:
        "Improve your sleep quality with these evidence-based sleep hygiene recommendations.",
      type: "article",
      tags: ["sleep", "health", "habits"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      id: "5",
      title: "Managing Depression: A Guide for Patients",
      description:
        "Comprehensive information about depression, treatment options, and self-care strategies.",
      type: "pdf",
      tags: ["depression", "self-care", "treatment"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: "6",
      title: "Breathing Techniques for Anxiety Relief",
      description:
        "Learn simple breathing exercises to help manage anxiety and panic symptoms.",
      type: "video",
      tags: ["anxiety", "breathing", "techniques"],
      url: "#",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "article" | "video" | "pdf"
  >("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType =
      selectedType === "all" || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookText size={20} className="text-blue-600" />;
      case "video":
        return <Video size={20} className="text-red-600" />;
      case "pdf":
        return <File size={20} className="text-orange-600" />;
      default:
        return <BookText size={20} className="text-blue-600" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search resources by title, description or tags..."
            className="flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedType === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              selectedType === "article"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedType("article")}
          >
            <BookText size={16} className="mr-2" />
            Articles
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              selectedType === "video"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedType("video")}
          >
            <Video size={16} className="mr-2" />
            Videos
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              selectedType === "pdf"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedType("pdf")}
          >
            <File size={16} className="mr-2" />
            PDF Documents
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1">{getTypeIcon(resource.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                <p className="text-gray-600 mb-3">{resource.description}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-blue-50 text-blue-600 text-xs py-1 px-2 rounded-full"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  Added: {new Date(resource.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg shadow-md">
          <BookText size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
