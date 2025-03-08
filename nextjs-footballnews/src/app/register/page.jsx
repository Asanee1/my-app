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

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session } = useSession();
  if (session) redirect("/welcome");

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000); // 5 วินาที

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
      <div className="flex-grow flex items-center justify-center bg-gray-100 py-10 font-sans text-xl">
        <div className="w-full max-w-6xl flex bg-white shadow-lg rounded-lg p-8">
          <div className="w-full lg:w-1/2 px-8">
            <h3 className="text-3xl font-semibold mb-6 text-indigo-700">
              Register Page
            </h3>
            <hr className="my-4" />
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error shadow-lg mb-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 13l2-2m0 0l2 2m-2-2v6m-1-6a1 1 0 10-2 0m2 0a1 1 0 11-2 0m2 0a1 1 0 10-2 0m2 0a1 1 0 11-2 0M6 21H4a1 1 0 01-1-1V4a1 1 0 011-1h2m14 18h-2a1 1 0 01-1-1V4a1 1 0 011-1h2m-2 16h2a1 1 0 001-1V6a1 1 0 00-1-1h-2m0 0h-2m2 0V4a1 1 0 00-1-1h-2m2 0H5M4 4h2m0 0V4h-2M4 4V2M4 4h-2m2 0v2M5 4h2M5 4V2M5 4h-2m0 0v2M6 21h2m0 0v-2m0 2h2m0-2h2m0 2h2m-2 0h2m0-2v-2m0 2h2m0-2v-2m0 2h2m0 0v2m0 2h2m0 0v2m0 2h2"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="alert alert-success shadow-lg mb-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
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

              <div className="mb-4 relative">
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mb-4 relative">
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <Button type="submit">Sign Up</Button>
            </form>
            <hr className="my-4" />
            <p className="text-center">
              Go to{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>{" "}
              Page
            </p>
          </div>

          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default RegisterPage;
