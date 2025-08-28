import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import api from "@services/api";

import { useNavigate } from "react-router-dom";
import PasswordStrengthInput from "./passwordStrengthInput";

export default function LoginCard() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (showSignUp) {
        if (formData.password != formData.confirm_password) {
          setError("Passwords do not match");
          return;
        }

        // Sign up API call
        const res = await api.post("/auth/register", {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        });

        alert(
          res.data.message || "Account created successfully! Please log in."
        );
        setShowSignUp(false);
      } else {
        // Login API call
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // Save token
        localStorage.setItem("access_token", res.data.access_token);

        // Redirect based on role
        if (res.data.user.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }

      // Reset form fields
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
      });
    } catch (err) {
      // Display API error
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      {showSignUp ? (
        // SIGN UP CARD
        <Card>
          <CardHeader>
            <CardTitle>CREATE ACCOUNT</CardTitle>
            <CardDescription>
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Password with strength indicator */}
                <PasswordStrengthInput
                  password={formData.password}
                  setPassword={(value) =>
                    setFormData((prev) => ({ ...prev, password: value }))
                  }
                />
                {/* Confirm Password field */}
                <div className="grid gap-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex-col gap-2 mt-4">
                <Button type="submit" className="w-full bg-blue-950">
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  type="button"
                  onClick={() => setShowSignUp(false)}
                >
                  Already have an account? Log In
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      ) : (
        // LOGIN CARD
        <Card>
          <CardHeader>
            <CardTitle>WELCOME BACK</CardTitle>
            <CardDescription>
              Enter your Email and Password to Login to Your Account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex-col gap-2 mt-4">
                <Button type="submit" className="w-full bg-blue-950">
                  Login
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  type="button"
                  onClick={() => setShowSignUp(true)}
                >
                  Create Account
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
