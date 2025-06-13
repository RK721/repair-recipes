import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Write2RepairV1.png"; // Import the logo

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Write2Repair Logo" className="h-10 w-auto" />
          </Link>
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

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 bg-gray-100 text-center text-gray-600 text-sm">
        <div className="mb-2">
          © 2025 Write2Repair.net &mdash; Built by gearheads | Powered by
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
