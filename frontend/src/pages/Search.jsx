import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [tutorials, setTutorials] = useState([]);
  const [error, setError] = useState(null);

  // Load makes on initial render
  useEffect(() => {
    axios
      .get("http://localhost:8000/vehicles/makes/")
      .then((res) => setMakes(res.data))
      .catch(() => setError("Failed to load makes"));
  }, []);

  // Load models when make is selected
  useEffect(() => {
    if (make) {
      axios
        .get(`http://localhost:8000/vehicles/models/?make=${make}`)
        .then((res) => setModels(res.data))
        .catch(() => setError("Failed to load models"));
    }
    setModel("");
    setYear("");
    setYears([]);
    setTutorials([]);
  }, [make]);

  // Load years when model is selected
  useEffect(() => {
    if (make && model) {
      axios
        .get(
          `http://localhost:8000/vehicles/years/?make=${make}&model=${model}`
        )
        .then((res) => setYears(res.data))
        .catch(() => setError("Failed to load years"));
    }
    setYear("");
    setTutorials([]);
  }, [model, make]);

  // Load tutorials when year is selected
  useEffect(() => {
    if (!make || !model || !year) return;
    axios
      .get(
        `http://localhost:8000/tutorials/?make=${make}&model=${model}&year=${year}`
      )
      .then((res) => setTutorials(res.data))
      .catch(() => setError("Failed to load tutorials"));
  }, [year, make, model]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Find Repair Tutorials for Your Vehicle
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Choose your car below to see step-by-step repair guides written by real
        people.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        className="flex flex-wrap gap-4 mb-8 justify-center items-end bg-white rounded shadow p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block mb-1 font-semibold" htmlFor="make">
            Make
          </label>
          <select
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border p-2 w-40 rounded"
          >
            <option value="">Select Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="model">
            Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="border p-2 w-40 rounded bg-gray-100 disabled:opacity-60"
          >
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="year">
            Year
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!model}
            className="border p-2 w-40 rounded bg-gray-100 disabled:opacity-60"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </form>

      {make && model && year && (
        <div className="mb-8 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded font-semibold">
            Showing results for: {year} {make} {model}
          </span>
        </div>
      )}

      {tutorials.length > 0 ? (
        <ul className="space-y-4">
          {tutorials.map((t) => (
            <li key={t.id} className="bg-white rounded shadow p-4">
              <Link
                to={`/tutorials/${t.id}`}
                className="text-blue-700 font-bold text-lg hover:underline"
              >
                {t.title}
              </Link>
              {t.description && (
                <p className="text-gray-700 mt-1">{t.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                {t.estimated_time && (
                  <span>
                    🕒 {t.estimated_time.replace("PT", "").toLowerCase()}
                  </span>
                )}
                {t.difficulty && <span>⭐ {t.difficulty}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        make &&
        model &&
        year && (
          <div className="text-center text-gray-500 mt-8">
            <p>No tutorials found for this vehicle.</p>
            <Link
              to="/submit"
              className="inline-block mt-2 text-blue-600 underline"
            >
              Be the first to submit one!
            </Link>
          </div>
        )
      )}
    </div>
  );
}
