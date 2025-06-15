import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MEDIA_URL = "http://localhost:8000/media/";

export default function TutorialDetail() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/tutorials/${id}/`)
      .then((res) => setTutorial(res.data))
      .catch((err) => console.error("Error loading tutorial:", err));
  }, [id]);

  if (!tutorial) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{tutorial.title}</h1>
      <p className="text-sm text-gray-500">
        {tutorial.vehicle.year} {tutorial.vehicle.make} {tutorial.vehicle.model}
      </p>

      <h2 className="mt-6 text-lg font-semibold">Tools</h2>
      <ul className="list-disc pl-6">
        {tutorial.tools.map((tool) => (
          <li key={tool.id}>
            {tool.name}
            {tool.affiliate_link && (
              <>
                {" "}
                —{" "}
                <a
                  href={tool.affiliate_link}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy
                </a>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Parts</h2>
      <ul className="list-disc pl-6">
        {tutorial.parts.map((part) => (
          <li key={part.id}>
            {part.name} ({part.part_number})
            {part.affiliate_link && (
              <>
                {" "}
                —{" "}
                <a
                  href={part.affiliate_link}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy
                </a>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Steps</h2>
      <ol className="list-decimal pl-6">
        {tutorial.steps.map((step, idx) => (
          <li key={step.id || idx} className="mb-6">
            <p className="mb-2">{step.instruction}</p>
            {step.image && (
              <img
                src={
                  step.image.startsWith("http")
                    ? step.image
                    : MEDIA_URL + step.image
                }
                alt={`Step ${step.step_number} illustration`}
                className="max-w-xs rounded border mb-2"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
