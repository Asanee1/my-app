"use client";

import React, { useState } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { motion } from "framer-motion"; // Import motion

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedUser", email);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      router.replace("/welcome");
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <Container>
      <Navbar />
      <motion.div
        className="flex-grow flex items-center justify-center bg-gray-100 font-sans text-gray-900 py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden p-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-center mb-6">
            <img src="/images/Applogo.png" className="w-24" alt="Logo" />
          </div>
          <motion.h1
            className="text-3xl font-bold text-purple-700 text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome back!
          </motion.h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<AiOutlineMail className="w-6 h-6 text-gray-400" />}
              error={error && !email && "Email is required"}
              required={true}
            />

            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<AiOutlineLock className="w-6 h-6 text-gray-400" />}
                error={error && !password && "Password is required"}
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

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-purple-600 focus:ring-purple-500"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
            </div>

            <motion.button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white rounded-md px-4 py-2 mt-4 w-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-purple-600 hover:underline"
              >
                Register
              </Link>
            </span>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </Container>
  );
}

export default LoginPage;
