import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";
import NotFound from "./NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login"></Navigate>;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

export default function App() {
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
      .catch((err) => setError("Failed to load makes"));
  }, []);

  // Load models when make is selected
  useEffect(() => {
    if (make) {
      axios
        .get(`http://localhost:8000/vehicles/models/?make=${make}`)
        .then((res) => setModels(res.data))
        .catch((err) => setError("Failed to load models"));
    }
    setModel("");
    setYear("");
    setYears([]);
    setTutorials([]);
  }, [make]);

  // Load years when model is selected
  useEffect(() => {
    if (!(!make || !model)) {
      axios
        .get(
          `http://localhost:8000/vehicles/years/?make=${make}&model=${model}`
        )
        .then((res) => setYears(res.data))
        .catch((err) => setError("Failed to load years"));
    }
    setYear("");
    setTutorials([]);
  }, [model]);

  // Load tutorials when year is selected
  useEffect(() => {
    if (!make || !model || !year) return;
    axios
      .get(
        `http://localhost:8000/tutorials/?make=${make}&model=${model}&year=${year}`
      )
      .then((res) => setTutorials(res.data))
      .catch((err) => setError("Failed to load tutorials"));
  }, [year]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Repair Recipes</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="border p-2 w-40"
        >
          <option value="">Select Make</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!make}
          className="border p-2 w-40"
        >
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={!model}
          className="border p-2 w-40"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Link
          to="/submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit a Tutorial
        </Link>
      </div>

      {tutorials.length > 0 ? (
        <ul className="list-disc pl-6">
          {tutorials.map((t) => (
            <li key={t.id} className="mb-2">
              <Link
                to={`/tutorials/${t.id}`}
                className="text-blue-600 underline"
              >
                <strong>{t.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        make && model && year && <p>No tutorials found for this vehicle.</p>
      )}
    </div>
  );
}
