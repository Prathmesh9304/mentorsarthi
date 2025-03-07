import { useState, useEffect } from "react";
import { FaBook, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const ResourcesAndGuidelines = () => {
  const [resources, setResources] = useState({
    guidelines: [],
    materials: [],
    tutorials: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/mentor/resources",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setResources({
            guidelines: [],
            materials: [],
            tutorials: [],
          });
        } else {
          throw new Error("Failed to fetch resources");
        }
      } else {
        const data = await response.json();
        setResources(data);
      }
      setLoading(false);
    } catch (error) {
      if (!error.message.includes("404")) {
        toast.error("Error fetching resources");
      }
      setResources({
        guidelines: [],
        materials: [],
        tutorials: [],
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Resources & Guidelines
      </h1>

      {/* Mentoring Guidelines */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaBook className="text-indigo-600 mr-2" />
          Mentoring Guidelines
        </h2>
        {resources.guidelines.length > 0 ? (
          <div className="space-y-4">
            {resources.guidelines.map((guideline) => (
              <div key={guideline._id} className="border-b pb-4 last:border-0">
                <h3 className="font-medium text-gray-900 mb-2">
                  {guideline.title}
                </h3>
                <p className="text-gray-600">{guideline.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No guidelines available</p>
            <p className="text-gray-400 text-sm mt-2">
              Guidelines will be added soon
            </p>
          </div>
        )}
      </div>

      {/* Teaching Materials */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Teaching Materials
        </h2>
        {resources.materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.materials.map((material) => (
              <div key={material._id} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {material.description}
                </p>
                <a
                  href={material.downloadUrl}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <FaDownload className="mr-2" />
                  Download Material
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaDownload className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No materials available</p>
            <p className="text-gray-400 text-sm mt-2">
              Teaching materials will be added soon
            </p>
          </div>
        )}
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Video Tutorials
        </h2>
        {resources.tutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.tutorials.map((tutorial) => (
              <div key={tutorial._id} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {tutorial.description}
                </p>
                <a
                  href={tutorial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Watch Tutorial
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaExternalLinkAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No tutorials available</p>
            <p className="text-gray-400 text-sm mt-2">
              Video tutorials will be added soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesAndGuidelines;
