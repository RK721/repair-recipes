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
  }, [model]);

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
    setDuration({ ...duration, [name]: value });
    // Optionally update form.estimated_time here if you want to keep it in sync

    let h = 0;
    let m = 0;
    if (e.target.name == "minutes") {
      h = parseInt(duration.hours);
      m = parseInt(e.target.value);
    } else {
      h = parseInt(e.target.value);
      m = parseInt(duration.minutes);
    }
    console.log(m);
    const estimated_time = `${("0" + h).slice(-2)}:${("0" + m).slice(
      -2
    )}:00.000000`;

    setForm({ ...form, estimated_time: estimated_time });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      estimated_time: form.estimated_time,
      difficulty: form.difficulty,
      vehicle: form.vehicle,
      tools: form.tools,
      parts: form.parts,
      steps: form.steps.map((step, i) => ({
        step_number: i + 1,
        instruction: step.instruction,
      })),
    };

    try {
      await axios.post("http://localhost:8000/tutorials/create/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Tutorial submitted!");
    } catch (err) {
      console.error("Submission error:", err.response?.data || err);
      alert("Failed to submit tutorial.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a Repair Tutorial</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-4 0.5rem">
          <select
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              handleChange(e, ["vehicle", null, "make"]);
            }}
            className="border p-2 w-40"
            required
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
            onChange={(e) => {
              setModel(e.target.value);
              handleChange(e, ["vehicle", null, "model"]);
            }}
            disabled={!make}
            className="border p-2 w-40"
            required
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
            onChange={(e) => {
              setYear(e.target.value);
              handleChange(e, ["vehicle", null, "year"]);
            }}
            disabled={!model}
            className="border p-2 w-40"
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
        <input
          className="w-full border p-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <p>Estimated Time:</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            className="border p-2 w-20"
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
            className="border p-2 w-20"
            placeholder="Minutes"
            name="minutes"
            value={duration.minutes}
            onChange={handleDurationChange}
            required
          />
          <span>Minutes</span>
        </div>
        <p>Difficulty:</p>
        <select
          value={form.difficulty}
          onChange={(e) => {
            setForm({ ...form, difficulty: e.target.value });
          }}
          className="border p-2 w-40"
          required
        >
          <option value="">-</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <h2 className="text-xl font-semibold">Tools</h2>
        {form.tools.map((tool, i) => (
          <div key={i} className="space-y-1">
            <input
              className="w-full border p-2"
              placeholder="Name"
              value={tool.name}
              onChange={(e) => handleChange(e, ["tools", i, "name"])}
              required
            />
            <input
              className="w-full border p-2"
              placeholder="Affiliate Link"
              value={tool.affiliate_link}
              onChange={(e) => handleChange(e, ["tools", i, "affiliate_link"])}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("tools")}
          className="text-blue-500 underline"
        >
          + Add Tool
        </button>

        <h2 className="text-xl font-semibold">Parts</h2>
        {form.parts.map((part, i) => (
          <div key={i} className="space-y-1">
            <input
              className="w-full border p-2"
              placeholder="Name"
              value={part.name}
              onChange={(e) => handleChange(e, ["parts", i, "name"])}
              required
            />
            <input
              className="w-full border p-2"
              placeholder="Part Number"
              value={part.part_number}
              onChange={(e) => handleChange(e, ["parts", i, "part_number"])}
              required
            />
            <input
              className="w-full border p-2"
              placeholder="Affiliate Link"
              value={part.affiliate_link}
              onChange={(e) => handleChange(e, ["parts", i, "affiliate_link"])}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("parts")}
          className="text-blue-500 underline"
        >
          + Add Part
        </button>

        <h2 className="text-xl font-semibold">Steps</h2>
        {form.steps.map((step, i) => (
          <div key={i} className="space-y-1">
            <textarea
              className="w-full border p-2"
              placeholder="Instruction"
              value={step.instruction}
              onChange={(e) => handleChange(e, ["steps", i, "instruction"])}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("steps")}
          className="text-blue-500 underline p-2"
        >
          + Add Step
        </button>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Submit Tutorial
        </button>
      </form>
    </div>
  );
}
