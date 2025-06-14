import React from "react";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        <strong>Write2Repair</strong> is a community-driven platform for sharing
        and discovering step-by-step car repair tutorials. Our mission is to
        empower everyone—from DIYers to professional mechanics—to work on their
        vehicles with confidence, save money, and share knowledge.
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
