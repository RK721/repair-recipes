import React, { useEffect, useState } from "react";
import axios from "axios";
import { USERNAME, ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem(USERNAME);
    if (username) {
      axios
        .get(`http://localhost:8000/users/${username}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser({ username }));
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage("");
    try {
      await axios.post(
        "http://localhost:8000/user/change-password/",
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );
      setPwMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMessage(err.response?.data?.detail || "Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    try {
      await axios.delete("http://localhost:8000/user/delete/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });
      setDeleteMessage("Account deleted. Redirecting...");
      localStorage.clear();
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setDeleteMessage(
        err.response?.data?.detail || "Failed to delete account."
      );
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
      <div className="mb-2">
        <span className="font-semibold">Username:</span> {user.username}
      </div>
      {user.email && (
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </div>
      )}

      {/* Reset Password */}
      <form onSubmit={handlePasswordChange} className="mt-8 space-y-2">
        <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Change Password
        </button>
        {pwMessage && (
          <div className="text-sm mt-2 text-center text-blue-700">
            {pwMessage}
          </div>
        )}
      </form>

      {/* Delete Account */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2 text-red-700">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
        >
          Delete Account
        </button>
        {deleteMessage && (
          <div className="text-sm mt-2 text-center text-red-700">
            {deleteMessage}
          </div>
        )}
      </div>
    </div>
  );
}
