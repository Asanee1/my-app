// src/app/profile/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaLock, FaSave } from "react-icons/fa"; // Import Icons
import { motion } from "framer-motion"; // For Animations

export default function Profile() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) redirect("/login");
  }, [session, status]);

  useEffect(() => {
    if (session) {
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const body = { name, email };
      if (password.trim() !== "") {
        body.password = password.trim();
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        await update({
          ...session,
          user: {
            ...session.user,
            name: data.user.name,
            email: data.user.email,
          },
        });
        setSuccessMessage(data.message);
        setPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="text-purple-600 text-4xl font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!session) {
    redirect("/login"); // Redirect to login page if not authenticated
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <motion.div
        className="container mx-auto p-10 flex justify-center items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <motion.h3
            className="text-3xl font-bold text-purple-700 mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaUser className="inline-block mr-2" />
            Welcome, {session?.user?.name}
          </motion.h3>

          {/* Edit Profile Form */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {successMessage}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                <FaUser className="inline-block mr-2" />
                Name:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                <FaEnvelope className="inline-block mr-2" />
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                <FaLock className="inline-block mr-2" />
                New Password (optional):
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              onClick={handleUpdateProfile}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white rounded-md px-4 py-2 mt-4 w-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave className="mr-2" />
              {isLoading ? "Updating..." : "Update Profile"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
