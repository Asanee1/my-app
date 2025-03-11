"use client";

import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { motion } from "framer-motion"; // Import motion

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session } = useSession();
  if (session) redirect("/welcome");

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    try {
      const resCheckUser = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await resCheckUser.json();
      if (data.userExists) {
        setError("User with this email already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setError("");
        setSuccess("User registered successfully!");
        e.target.reset();
      } else {
        setError("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration: ", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <Navbar />
      <motion.div
        className="flex-grow flex items-center justify-center bg-gray-100 py-10 font-sans text-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-6xl flex bg-white shadow-2xl rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full lg:w-1/2 px-8 py-8">
            <motion.h3
              className="text-3xl font-bold text-purple-700 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              REGISTER
            </motion.h3>
            <hr className="my-4" />
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  {success}
                </div>
              )}

              <InputField
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error && !name && "Name is required"}
                icon={<AiOutlineUser className="w-6 h-6 text-gray-400" />}
                required={true}
              />

              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error && !email && "Email is required"}
                icon={<AiOutlineMail className="w-6 h-6 text-gray-400" />}
                required={true}
              />

              <div className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error && !password && "Password is required"}
                  icon={<AiOutlineLock className="w-6 h-6 text-gray-400" />}
                  required={true}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-purple-600 hover:text-purple-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={
                    error && !confirmPassword && "Confirm Password is required"
                  }
                  icon={<AiOutlineLock className="w-6 h-6 text-gray-400" />}
                  required={true}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-purple-600 hover:text-purple-800"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <motion.button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white rounded-md px-4 py-2 mt-4 w-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </form>
            <hr className="my-4" />
            <p className="text-center">
              Go to{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Login
              </Link>{" "}
              Page
            </p>
          </div>

          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <motion.div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </Container>
  );
}

export default RegisterPage;
