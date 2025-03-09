import { useState } from "react";
import { MessageCircle, Users, Search } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  imageUrl?: string;
  tags: string[];
}

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "1",
      name: "Anxiety Support Group",
      description:
        "A supportive community for people dealing with anxiety disorders. Share experiences and coping strategies.",
      members: 234,
      tags: ["anxiety", "support", "coping"],
    },
    {
      id: "2",
      name: "Depression Recovery",
      description:
        "For individuals on the journey to recovery from depression. Encouragement, resources, and understanding.",
      members: 189,
      tags: ["depression", "recovery", "mental health"],
    },
    {
      id: "3",
      name: "Mindfulness Meditation",
      description:
        "Learn and practice mindfulness techniques for better mental health and stress reduction.",
      members: 312,
      tags: ["mindfulness", "meditation", "stress"],
    },
    {
      id: "4",
      name: "ADHD Strategies",
      description:
        "Share effective strategies for managing ADHD in daily life, work, and relationships.",
      members: 156,
      tags: ["ADHD", "focus", "productivity"],
    },
    {
      id: "5",
      name: "Sleep Improvement",
      description:
        "Discussions about improving sleep quality and overcoming insomnia and other sleep disorders.",
      members: 143,
      tags: ["sleep", "insomnia", "rest"],
    },
    {
      id: "6",
      name: "Stress Management",
      description:
        "Learn effective ways to manage and reduce stress in your personal and professional life.",
      members: 211,
      tags: ["stress", "management", "wellness"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Users size={18} className="mr-2" />
          Create Community
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-3 flex items-center">
        <Search size={20} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search communities by name, description or tags..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  {community.imageUrl ? (
                    <img
                      src={community.imageUrl}
                      alt={community.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{community.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {community.members} members
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {community.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {community.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 text-xs py-1 px-2 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full bg-blue-50 text-blue-600 border border-blue-100 py-2 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                <MessageCircle size={16} className="mr-2" />
                Join Community
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg shadow-md">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-gray-600">
            Try adjusting your search or create a new community
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
