import React, { useState } from "react";
import api from "../api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const [showLoginLink, setShowLoginLink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const name = method === "login" ? "Login" : "Register";

  // Password must be at least 8 chars, 1 letter, 1 number
  const passwordValid =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    setLoading(true);
    setErrorMsg("");
    setShowRegisterLink(false);
    setShowLoginLink(false);
    e.preventDefault();

    if (method === "register" && !passwordValid) {
      setErrorMsg(
        "Password must be at least 8 characters and include a letter and a number."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(route, { username, password, email });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem(USERNAME, username);
      window.dispatchEvent(new Event("username-updated"));
      // Redirect to previous page or home
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // Try to parse error response
      let msg = "An error occurred.";
      if (error.response) {
        // Django REST Framework default error keys
        if (error.response.data.detail) {
          msg = error.response.data.detail;
          // If login failed due to user not found
          if (
            msg.toLowerCase().includes("no active account") ||
            msg.toLowerCase().includes("not found")
          ) {
            setShowRegisterLink(true);
            msg = "User not found. Would you like to register?";
          }
        }
        // If registering and username/email already exists
        if (error.response.data.username) {
          msg = "Username already exists.";
          setShowLoginLink(true);
        }
        if (error.response.data.email) {
          msg = "Email already registered.";
          setShowLoginLink(true);
        }
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      {errorMsg && (
        <div className="mb-2 text-red-600 text-sm">
          {errorMsg}
          {showRegisterLink && (
            <span>
              {" "}
              <Link to="/register" className="underline text-blue-600">
                Register
              </Link>
            </span>
          )}
          {showLoginLink && (
            <span>
              {" "}
              <Link to="/login" className="underline text-blue-600">
                Login
              </Link>
            </span>
          )}
        </div>
      )}
      <input
        className="form-input"
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {method === "register" && (
        <input
          className="form-input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      )}
      <input
        className="form-input"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {method === "register" && password && !passwordValid && (
        <div className="mb-2 text-yellow-700 text-xs">
          Password must be at least 8 characters and include a letter and a
          number.
        </div>
      )}
      {method === "login" && (
        <div className="mt-2 text-sm text-right w-full">
          <Link to="/forgot-password" className="text-blue-600 underline">
            Forgot password?
          </Link>
        </div>
      )}
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
      {method === "login" && (
        <div className="mt-2 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="underline text-blue-600">
            Register
          </Link>
        </div>
      )}
      {method === "register" && (
        <div className="mt-2 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-600">
            Login
          </Link>
        </div>
      )}
    </form>
  );
}

export default Form;
