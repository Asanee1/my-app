"use client";

import React, { useState } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import InputField from "../components/InputField"; // Changed import path
import Button from "../components/Button"; // Changed import path
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.replace("welcome");
  }

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
        setError("Invalid credentials");
        return;
      }
        
      if (rememberMe) {
        // Store user's email or a unique identifier in localStorage or cookies
        // This is a simplified example. You may want to use a more secure method
        // to store the user's identifier.
        localStorage.setItem('rememberedUser', email);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      router.replace("welcome");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-100 font-sans text-gray-900 py-10">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <div className="flex justify-center mb-6">
                        <img src="/images/Applogo.png" className="w-24" alt="Logo" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Welcome back!
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="alert alert-error">
                                <div>
                                    <span>{error}</span>
                                </div>
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
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                           <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox text-indigo-600"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Remember me
                            </span>
                        </label>
                        </div>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-indigo-600 hover:underline">
                                Register
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </Container>
  );
}

export default LoginPage;
