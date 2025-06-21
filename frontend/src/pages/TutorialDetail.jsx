import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MEDIA_URL = "http://localhost:8000/media/";

export default function TutorialDetail() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/tutorials/${id}/`)
      .then((res) => setTutorial(res.data))
      .catch((err) => {
        console.error("Error loading tutorial:", err);
        setError("Failed to load tutorial");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatDuration = (duration) => {
    if (!duration) return "";
    // Convert PT1H30M format to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return duration;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Tutorial Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The tutorial you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/search" className="btn btn-primary">
            Browse Tutorials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link
                to="/search"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Tutorials
              </Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-900 font-medium">
                {tutorial.title}
              </span>
            </nav>

            <div className="animate-slide-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {tutorial.title}
              </h1>

              {tutorial.vehicle && (
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium mb-4">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  {tutorial.vehicle.year} {tutorial.vehicle.make}{" "}
                  {tutorial.vehicle.model}
                  {tutorial.vehicle.engine && ` - ${tutorial.vehicle.engine}`}
                </div>
              )}

              {tutorial.description && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {tutorial.description}
                </p>
              )}

              {/* Tutorial Meta */}
              <div className="flex flex-wrap gap-6 text-sm">
                {tutorial.estimated_time && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Estimated Time:</span>
                    <span className="ml-1">
                      {formatDuration(tutorial.estimated_time)}
                    </span>
                  </div>
                )}

                {tutorial.difficulty && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <span className="font-medium">Difficulty:</span>
                    <span className="ml-1">{tutorial.difficulty}</span>
                  </div>
                )}

                {tutorial.steps && tutorial.steps.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <span className="font-medium">Steps:</span>
                    <span className="ml-1">{tutorial.steps.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Steps Section */}
              {tutorial.steps && tutorial.steps.length > 0 && (
                <div className="card p-8 animate-fade-in">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Step-by-Step Instructions
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {tutorial.steps.map((step, idx) => (
                      <div key={step.id || idx} className="flex">
                        {/* Step Number */}
                        <div className="flex-shrink-0 mr-6">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {step.step_number || idx + 1}
                            </span>
                          </div>
                          {idx < tutorial.steps.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mx-auto mt-4"></div>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pb-8">
                          <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                              {step.instruction}
                            </p>

                            {step.image && (
                              <div className="mt-4">
                                <img
                                  src={
                                    step.image.startsWith("http")
                                      ? step.image
                                      : MEDIA_URL + step.image
                                  }
                                  alt={`Step ${
                                    step.step_number || idx + 1
                                  } illustration`}
                                  className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tools Section */}
              {tutorial.tools && tutorial.tools.length > 0 && (
                <div className="card p-6 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573  1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Required Tools
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {tutorial.tools.map((tool) => (
                      <li key={tool.id} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1">
                          <span className="text-gray-800 text-sm">
                            {tool.name}
                          </span>
                          {tool.affiliate_link && (
                            <a
                              href={tool.affiliate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-700 text-xs mt-1 transition-colors duration-200"
                            >
                              Buy Online →
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Parts Section */}
              {tutorial.parts && tutorial.parts.length > 0 && (
                <div className="card p-6 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Required Parts
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {tutorial.parts.map((part) => (
                      <li
                        key={part.id}
                        className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start">
                          <svg
                            className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex-1">
                            <div className="text-gray-800 text-sm font-medium">
                              {part.name}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                              Part #: {part.part_number}
                            </div>
                            {part.affiliate_link && (
                              <a
                                href={part.affiliate_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs mt-1 inline-block transition-colors duration-200"
                              >
                                Buy Online →
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author Info */}
              {tutorial.author && (
                <div className="card p-6 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Author</h3>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">
                        {tutorial.author.username
                          ? tutorial.author.username.charAt(0).toUpperCase()
                          : "A"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {tutorial.author.username || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">Contributor</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Tutorials */}
          <div className="mt-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Find More Tutorials
              </h3>
              <p className="text-gray-600 mb-8">
                Looking for more repair guides? Browse our collection of
                tutorials.
              </p>
              <Link to="/search" className="btn btn-primary btn-lg group">
                <svg
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse All Tutorials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
