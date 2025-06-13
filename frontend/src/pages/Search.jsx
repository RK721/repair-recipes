import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Search() {
  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧰</span>
          <span className="font-bold text-xl tracking-tight">
            REPAIRRECIPES.IO
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/search" className="hover:underline">
            Search
          </Link>
          <Link to="/submit" className="hover:underline">
            Submit Tutorial
          </Link>
          <Link to="/login" className="hover:underline">
            Login / Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl font-extrabold mb-4">
          Fix Any Car, One Step at a Time
        </h1>
        <p className="text-lg mb-6 max-w-2xl">
          Search, share, and follow repair tutorials written like recipes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/search"
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            🔍 Start Searching
          </Link>
          <Link
            to="/submit"
            className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
          >
            📤 Submit a Tutorial
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 text-left max-w-3xl mx-auto">
          <div>
            <h2 className="font-bold text-lg mb-2">🔧 For DIYers</h2>
            <p>Easy, step-by-step guides tailored to your car</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2">🛠️ For Mechanics</h2>
            <p>Share your knowledge and get rewarded</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          🔍 Search That Actually Works
        </h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Choose Year, Make, Model</li>
          <li>See only relevant tutorials</li>
          <li>Step-by-step, like following a cooking recipe</li>
        </ul>
        <p className="mb-8 font-semibold text-blue-700">
          🎯 Get straight to the fix — no noise.
        </p>

        <h2 className="text-2xl font-bold mb-4">🧠 Tutorials by Real People</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>✅ Tools and parts you’ll need (with links)</li>
          <li>🕒 Estimated time & difficulty</li>
          <li>📸 Optional photos and step images</li>
          <li>📘 Clear, structured steps you can follow in your garage</li>
        </ul>
        <blockquote className="italic border-l-4 border-blue-400 pl-4 mb-8">
          ⭐ “It’s like AllRecipes, but for car repairs.” — Beta tester
        </blockquote>

        <h2 className="text-2xl font-bold mb-4">
          👨‍🔧 Are You a Mechanic or DIY Pro?
        </h2>
        <p className="mb-2">
          Your knowledge is valuable. Turn your experience into reach,
          recognition, and revenue:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>🔧 Submit tutorials in minutes</li>
          <li>🌟 Get featured and ranked</li>
          <li>💵 Add affiliate links to your favorite tools</li>
          <li>🎁 Earn rewards for most helpful content</li>
        </ul>
        <Link
          to="/signup"
          className="bg-yellow-500 text-white px-6 py-3 rounded font-semibold hover:bg-yellow-600 transition mb-8 inline-block"
        >
          Become a Contributor
        </Link>

        <h2 className="text-2xl font-bold mb-4">🧭 How It Works</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Search or browse repairs for your car</li>
          <li>Follow step-by-step guides with confidence</li>
          <li>Submit your own fixes to help others and earn</li>
        </ul>
        <p className="mb-8">Built by car people. For car people.</p>

        <h2 className="text-2xl font-bold mb-4">
          💸 Coming Soon: Rewards Program
        </h2>
        <p className="mb-2">
          We're building the first repair content platform where:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Contributors keep control</li>
          <li>Viewers get real value</li>
          <li>Everyone wins</li>
        </ul>
        <p className="mb-8">
          🔜 Ad revenue, affiliate revenue, and tool giveaways for top creators.
        </p>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8 bg-blue-50">
        <span className="font-bold text-lg mb-2 sm:mb-0">
          Try the Beta Now — It’s Free
        </span>
        <Link
          to="/search"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          🔍 Explore Tutorials
        </Link>
        <Link
          to="/submit"
          className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
        >
          📤 Submit a Tutorial
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 bg-gray-100 text-center text-gray-600 text-sm">
        <div className="mb-2">
          © 2025 RepairRecipes.io &mdash; Built by gearheads | Powered by
          community
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Search;
