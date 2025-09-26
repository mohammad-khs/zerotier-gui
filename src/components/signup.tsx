"use client";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuthState } from "@/stores/store";
import toast from "react-hot-toast";
import { authSchema } from "@/lib/validation";

const SignUp: FC = () => {
  const { username, password, setUsername, setPassword } = useAuthState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedResult = authSchema.safeParse({ username, password });
    if (parsedResult.error) {
      const errorMessage = parsedResult.error.issues
        .map((err) => err.message)
        .join(", ");
      toast.error(errorMessage);
      return;
    }
    setLoading(true);

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
        toast.error(data.errors);
        setLoading(false);
        return;
      }
      toast.success(`Signup successful! Welcome, ${data.user}`);
    } catch (error) {
      console.error("There was a problem with the signup request:", error);
      toast.error("Network error during signup");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col  gap-4 mt-4">
      <Input
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        disabled={loading}
        type="submit"
        variant={"blue"}
        className="bg-green-600 hover:bg-green-500"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUp;
