"use client";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuthState } from "@/stores/store";

const SignUp: FC = () => {
  const { username, password, setUsername, setPassword } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.error || JSON.stringify(data.errors) || "Signup failed"
        );
        setLoading(false);
        return;
      }

      setMessage(`Signup successful! Welcome, ${data.user.username}`);
    } catch (error) {
      console.error("There was a problem with the signup request:", error);
      setMessage("Network error during signup");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <Input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <Button
        disabled={loading}
        type="submit"
        className="mt-2 bg-green-500 text-white p-2 rounded"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </form>
  );
};

export default SignUp;
