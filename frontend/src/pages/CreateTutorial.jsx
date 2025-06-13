import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreateTutorial() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    estimated_time: "",
    difficulty: "",
    vehicle: { year: "", make: "", model: "", engine: "", trim: "" },
    tools: [{ name: "", affiliate_link: "" }],
    parts: [{ name: "", part_number: "", affiliate_link: "" }],
    steps: [{ instruction: "" }],
  });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [duration, setDuration] = useState({ hours: "", minutes: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
  }, [model, make]);

  const handleChange = (e, path) => {
    const [section, index, key] = path;
    const newForm = { ...form };
    if (section === "vehicle") {
      newForm.vehicle[key] = e.target.value;
    } else {
      newForm[section][index][key] = e.target.value;
    }
    setForm(newForm);
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    const newDuration = { ...duration, [name]: value };
    setDuration(newDuration);

    // Convert to HH:MM:SS for backend
    const h = parseInt(newDuration.hours) || 0;
    const m = parseInt(newDuration.minutes) || 0;
    const estimated_time = `${("0" + h).slice(-2)}:${("0" + m).slice(
      -2
    )}:00.000000`;
    setForm({ ...form, estimated_time });
  };

  const addField = (section) => {
    const newForm = { ...form };
    const empty =
      section === "tools"
        ? { name: "", affiliate_link: "" }
        : section === "parts"
        ? { name: "", part_number: "", affiliate_link: "" }
        : { instruction: "" };
    newForm[section].push(empty);
    setForm(newForm);
  };

  const removeField = (section, index) => {
    const newForm = { ...form };
    if (newForm[section].length > 1) {
      newForm[section].splice(index, 1);
      setForm(newForm);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (
      !form.title ||
      !form.description ||
      !form.estimated_time ||
      !form.difficulty
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.vehicle.make || !form.vehicle.model || !form.vehicle.year) {
      setError("Please select a vehicle (make, model, year).");
      return;
    }
    if (form.steps.length === 0 || !form.steps[0].instruction.trim()) {
      setError("Please add at least one step.");
      return;
    }

    const payload = {
      ...form,
      steps: form.steps.map((step, i) => ({
        step_number: i + 1,
        instruction: step.instruction,
      })),
    };

    try {
      await axios.post("http://localhost:8000/tutorials/create/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess("Tutorial submitted! Thank you for contributing.");
      setForm({
        title: "",
        description: "",
        estimated_time: "",
        difficulty: "",
        vehicle: { year: "", make: "", model: "", engine: "", trim: "" },
        tools: [{ name: "", affiliate_link: "" }],
        parts: [{ name: "", part_number: "", affiliate_link: "" }],
        steps: [{ instruction: "" }],
      });
      setMake("");
      setModel("");
      setYear("");
      setDuration({ hours: "", minutes: "" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit tutorial. Please check your input and try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Submit a Repair Tutorial
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Share your knowledge and help others fix their vehicles, step by step.
      </p>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      {success && (
        <div className="mb-4 text-green-600 text-center">{success}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white rounded shadow p-6"
      >
        {/* Vehicle Selection */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="make">
              Make
            </label>
            <select
              id="make"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                handleChange(e, ["vehicle", null, "make"]);
              }}
              className="border p-2 w-40 rounded"
              required
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
              onChange={(e) => {
                setModel(e.target.value);
                handleChange(e, ["vehicle", null, "model"]);
              }}
              disabled={!make}
              className="border p-2 w-40 rounded bg-gray-100 disabled:opacity-60"
              required
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
              onChange={(e) => {
                setYear(e.target.value);
                handleChange(e, ["vehicle", null, "year"]);
              }}
              disabled={!model}
              className="border p-2 w-40 rounded bg-gray-100 disabled:opacity-60"
              required
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Tutorial Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Brief Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
          />
        </div>

        {/* Estimated Time & Difficulty */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block mb-1 font-semibold">Estimated Time</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                className="border p-2 w-20 rounded"
                placeholder="Hours"
                name="hours"
                value={duration.hours}
                onChange={handleDurationChange}
                required
              />
              <span>Hours</span>
              <input
                type="number"
                min="0"
                max="59"
                className="border p-2 w-20 rounded"
                placeholder="Minutes"
                name="minutes"
                value={duration.minutes}
                onChange={handleDurationChange}
                required
              />
              <span>Minutes</span>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="border p-2 w-40 rounded"
              required
            >
              <option value="">Select</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Tools */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Tools</h2>
          {form.tools.map((tool, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Tool Name"
                value={tool.name}
                onChange={(e) => handleChange(e, ["tools", i, "name"])}
                required
              />
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Affiliate Link (optional)"
                value={tool.affiliate_link}
                onChange={(e) =>
                  handleChange(e, ["tools", i, "affiliate_link"])
                }
              />
              {form.tools.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 px-2"
                  onClick={() => removeField("tools", i)}
                  title="Remove"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("tools")}
            className="text-blue-600 underline mt-1"
          >
            + Add Tool
          </button>
        </div>

        {/* Parts */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Parts</h2>
          {form.parts.map((part, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Part Name"
                value={part.name}
                onChange={(e) => handleChange(e, ["parts", i, "name"])}
                required
              />
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Part Number"
                value={part.part_number}
                onChange={(e) => handleChange(e, ["parts", i, "part_number"])}
                required
              />
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Affiliate Link (optional)"
                value={part.affiliate_link}
                onChange={(e) =>
                  handleChange(e, ["parts", i, "affiliate_link"])
                }
              />
              {form.parts.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 px-2"
                  onClick={() => removeField("parts", i)}
                  title="Remove"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("parts")}
            className="text-blue-600 underline mt-1"
          >
            + Add Part
          </button>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Steps</h2>
          {form.steps.map((step, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <textarea
                className="flex-1 border p-2 rounded"
                placeholder={`Step ${i + 1} instruction`}
                value={step.instruction}
                onChange={(e) => handleChange(e, ["steps", i, "instruction"])}
                required
                rows={2}
              />
              {form.steps.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 px-2 mt-1"
                  onClick={() => removeField("steps", i)}
                  title="Remove"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("steps")}
            className="text-blue-600 underline mt-1"
          >
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition w-full mt-4"
        >
          Submit Tutorial
        </button>
      </form>
    </div>
  );
}
