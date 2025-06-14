import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { USERNAME } from "../constants";

export default function MyTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem(USERNAME);
    if (username) {
      axios
        .get(`http://localhost:8000/tutorials/?author=${username}`)
        .then((res) => setTutorials(res.data))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">📝 My Tutorials</h1>
      {loading ? (
        <div>Loading...</div>
      ) : tutorials.length === 0 ? (
        <div className="text-gray-600">
          You haven't submitted any tutorials yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {tutorials.map((tut) => (
            <li key={tut.id} className="border-b pb-2">
              <Link
                to={`/tutorials/${tut.id}`}
                className="text-blue-700 font-semibold hover:underline"
              >
                {tut.title}
              </Link>
              <div className="text-sm text-gray-500">{tut.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
