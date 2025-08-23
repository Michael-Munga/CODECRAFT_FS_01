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

export default function LoginCard() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    if (showSignUp) {
      // reset all for signup
      setFormData({ email: "", name: "", password: "" });
    } else {
      // reset only login fields
      setFormData((prev) => ({
        ...prev,
        email: "",
        password: "",
      }));
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
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
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
