import React from "react";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        <strong>Write2Repair</strong> stems from a passion for working on
        vehicles, but a lack of valuable information on how to do the work we
        want. Repair manuals are expensive and don't always cover every
        procedure. YouTube might not have a tutorial for your make and model.
        Forums have knowledgable experts, but information is often scattered
        across many threads.
      </p>
      <p>
        Write2Repair is a community-driven platform for sharing and discovering
        step-by-step car repair tutorials. Our mission is to empower
        everyone—from DIYers to professional mechanics—to work on their vehicles
        with confidence, save money, and share knowledge.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Find repair guides tailored to your exact vehicle</li>
        <li>Share your own expertise and help others</li>
        <li>Earn recognition and rewards for your contributions</li>
      </ul>
      <p>
        Built by car people, for car people. Join us and make repair knowledge
        accessible to all!
      </p>
    </div>
  );
}
