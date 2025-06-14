import React, { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    // In production, send to backend or email service
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">
        Have feedback, questions, or want to get involved? Fill out the form
        below or email us at{" "}
        <a
          href="mailto:info@write2repair.net"
          className="text-blue-600 underline"
        >
          info@write2repair.net
        </a>
        .
      </p>
      {sent ? (
        <div className="text-green-700 font-semibold">
          Thank you! We'll be in touch soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Your Email"
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Your Message"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
