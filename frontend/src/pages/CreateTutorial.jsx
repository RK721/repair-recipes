import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleStepFileChange = (e, idx, type) => {
    const file = e.target.files[0];
    const newSteps = [...form.steps];
    newSteps[idx][type] = file;
    setForm({ ...form, steps: newSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("estimated_time", form.estimated_time);
    formData.append("difficulty", form.difficulty);

    // Vehicle fields
    Object.entries(form.vehicle).forEach(([key, value]) => {
      formData.append(`vehicle.${key}`, value);
    });

    // Send tools, parts, steps as JSON strings
    formData.append("tools", JSON.stringify(form.tools));
    formData.append("parts", JSON.stringify(form.parts));
    // For steps, temporarily remove files, then add files separately
    const stepsNoFiles = form.steps.map(({ image, ...rest }, i) => ({
      ...rest,
      step_number: i + 1,
    }));
    formData.append("steps", JSON.stringify(stepsNoFiles));

    // Attach files for steps
    form.steps.forEach((step, i) => {
      if (step.image) formData.append(`step_images_${i}`, step.image);
    });

    try {
      const response = await axios.post("http://localhost:8000/tutorials/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });
      
      setSuccess("Tutorial submitted successfully! Thank you for contributing to the community.");
      
      // Reset form
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

      // Redirect to the new tutorial after a delay
      setTimeout(() => {
        navigate(`/tutorials/${response.data.id}`);
      }, 2000);
      
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit tutorial. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
              Submit a Repair Tutorial
            </h1>
            <p className="text-lg text-gray-600 animate-slide-up">
              Share your automotive knowledge and help others fix their vehicles with confidence.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 mb-1">Success!</h3>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Selection */}
            <div className="card p-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="make">
                    Make *
                  </label>
                  <select
                    id="make"
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value);
                      handleChange(e, ["vehicle", null, "make"]);
                    }}
                    className="select w-full"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="model">
                    Model *
                  </label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      handleChange(e, ["vehicle", null, "model"]);
                    }}
                    disabled={!make}
                    className="select w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="year">
                    Year *
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      handleChange(e, ["vehicle", null, "year"]);
                    }}
                    disabled={!model}
                    className="select w-full disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="engine">
                    Engine (Optional)
                  </label>
                  <input
                    type="text"
                    id="engine"
                    value={form.vehicle.engine}
                    onChange={(e) => handleChange(e, ["vehicle", null, "engine"])}
                    className="input w-full"
                    placeholder="e.g., 2.0L Turbo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="trim">
                    Trim (Optional)
                  </label>
                  <input
                    type="text"
                    id="trim"
                    value={form.vehicle.trim}
                    onChange={(e) => handleChange(e, ["vehicle", null, "trim"])}
                    className="input w-full"
                    placeholder="e.g., Sport, LX, Base"
                  />
                </div>
              </div>
            </div>

            {/* Tutorial Details */}
            <div className="card p-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Tutorial Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                    Tutorial Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., How to Replace Brake Pads"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="textarea w-full"
                    placeholder="Provide a brief overview of what this tutorial covers..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Time *
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={duration.hours}
                          onChange={handleDurationChange}
                          name="hours"
                          className="input w-full"
                          placeholder="Hours"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={duration.minutes}
                          onChange={handleDurationChange}
                          name="minutes"
                          className="input w-full"
                          placeholder="Minutes"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="difficulty">
                      Difficulty Level *
                    </label>
                    <select
                      id="difficulty"
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className="select w-full"
                      required
                    >
                      <option value="">Select Difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Section */}
            <div className="card p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Required Tools</h2>
                </div>
                <button
                  type="button"
                  onClick={() => addField("tools")}
                  className="btn btn-outline btn-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Tool
                </button>
              </div>

              <div className="space-y-4">
                {form.tools.map((tool, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tool.name}
                        onChange={(e) => handleChange(e, ["tools", i, "name"])}
                        className="input w-full"
                        placeholder="Tool name (e.g., Socket wrench set)"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={tool.affiliate_link}
                        onChange={(e) => handleChange(e, ["tools", i, "affiliate_link"])}
                        className="input w-full"
                        placeholder="Affiliate link (optional)"
                      />
                    </div>
                    {form.tools.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField("tools", i)}
                        className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Parts Section */}
            <div className="card p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Required Parts</h2>
                </div>
                <button
                  type="button"
                  onClick={() => addField("parts")}
                  className="btn btn-outline btn-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Part
                </button>
              </div>

              <div className="space-y-4">
                {form.parts.map((part, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    <div>
                      <input
                        type="text"
                        value={part.name}
                        onChange={(e) => handleChange(e, ["parts", i, "name"])}
                        className="input w-full"
                        placeholder="Part name"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={part.part_number}
                        onChange={(e) => handleChange(e, ["parts", i, "part_number"])}
                        className="input w-full"
                        placeholder="Part number"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={part.affiliate_link}
                        onChange={(e) => handleChange(e, ["parts", i, "affiliate_link"])}
                        className="input flex-1"
                        placeholder="Affiliate link (optional)"
                      />
                      {form.parts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("parts", i)}
                          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Section */}
            <div className="card p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Step-by-Step Instructions</h2>
                </div>
                <button
                  type="button"
                  onClick={() => addField("steps")}
                  className="btn btn-outline btn-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Step
                </button>
              </div>

              <div className="space-y-6">
                {form.steps.map((step, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Step {i + 1}</h3>
                      {form.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("steps", i)}
                          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Step
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions *
                        </label>
                        <textarea
                          value={step.instruction}
                          onChange={(e) => handleChange(e, ["steps", i, "instruction"])}
                          className="textarea w-full"
                          placeholder={`Describe what to do in step ${i + 1}...`}
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Step Image (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStepFileChange(e, i, "image")}
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                        />
                        {step.image && (
                          <p className="mt-2 text-sm text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {step.image.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Tutorial...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Tutorial
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}