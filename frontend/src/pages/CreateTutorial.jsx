import React, { useState } from 'react';
import axios from 'axios';

export default function CreateTutorial() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    estimated_time: '',
    difficulty: '',
    vehicle: { year: '', make: '', model: '', engine: '', trim: '' },
    tools: [{ name: '', affiliate_link: '' }],
    parts: [{ name: '', part_number: '', affiliate_link: '' }],
    steps: [{ instruction: '' }],
  });

  const handleChange = (e, path) => {
    const [section, index, key] = path;
    const newForm = { ...form };
    if (section === 'vehicle') {
      newForm.vehicle[key] = e.target.value;
    } else {
      newForm[section][index][key] = e.target.value;
    }
    setForm(newForm);
  };

  const addField = (section) => {
    const newForm = { ...form };
    const empty = section === 'tools'
      ? { name: '', affiliate_link: '' }
      : section === 'parts'
      ? { name: '', part_number: '', affiliate_link: '' }
      : { instruction: '' };
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
        instruction: step.instruction
      }))
    };

    try {
      await axios.post('http://localhost:8000/tutorials/create/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Tutorial submitted!');
    } catch (err) {
      console.error('Submission error:', err.response?.data || err);
      alert('Failed to submit tutorial.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a Repair Tutorial</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input className="w-full border p-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full border p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border p-2" placeholder="Estimated Time" value={form.estimated_time} onChange={e => setForm({ ...form, estimated_time: e.target.value })} />
        <input className="w-full border p-2" placeholder="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} />

        <h2 className="text-xl font-semibold">Vehicle</h2>
        {['year', 'make', 'model', 'engine', 'trim'].map(field => (
          <input key={field} className="w-full border p-2" placeholder={field} value={form.vehicle[field]} onChange={e => handleChange(e, ['vehicle', null, field])} />
        ))}

        <h2 className="text-xl font-semibold">Tools</h2>
        {form.tools.map((tool, i) => (
          <div key={i} className="space-y-1">
            <input className="w-full border p-2" placeholder="Name" value={tool.name} onChange={e => handleChange(e, ['tools', i, 'name'])} />
            <input className="w-full border p-2" placeholder="Affiliate Link" value={tool.affiliate_link} onChange={e => handleChange(e, ['tools', i, 'affiliate_link'])} />
          </div>
        ))}
        <button type="button" onClick={() => addField('tools')} className="text-blue-500 underline">+ Add Tool</button>

        <h2 className="text-xl font-semibold">Parts</h2>
        {form.parts.map((part, i) => (
          <div key={i} className="space-y-1">
            <input className="w-full border p-2" placeholder="Name" value={part.name} onChange={e => handleChange(e, ['parts', i, 'name'])} />
            <input className="w-full border p-2" placeholder="Part Number" value={part.part_number} onChange={e => handleChange(e, ['parts', i, 'part_number'])} />
            <input className="w-full border p-2" placeholder="Affiliate Link" value={part.affiliate_link} onChange={e => handleChange(e, ['parts', i, 'affiliate_link'])} />
          </div>
        ))}
        <button type="button" onClick={() => addField('parts')} className="text-blue-500 underline">+ Add Part</button>

        <h2 className="text-xl font-semibold">Steps</h2>
        {form.steps.map((step, i) => (
          <div key={i} className="space-y-1">
            <textarea className="w-full border p-2" placeholder="Instruction" value={step.instruction} onChange={e => handleChange(e, ['steps', i, 'instruction'])} />
          </div>
        ))}
        <button type="button" onClick={() => addField('steps')} className="text-blue-500 underline">+ Add Step</button>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit Tutorial</button>
      </form>
    </div>
  );
}