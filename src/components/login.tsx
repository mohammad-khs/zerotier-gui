"use client";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { useAuthState } from "@/stores/store";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authSchema } from "@/lib/validation";

const Login: FC = () => {
  const { username, password, setUsername, setPassword } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedResult = authSchema.safeParse({ username, password });
    if (parsedResult.error) {
      const errorMessage = parsedResult.error.issues.map(err => err.message).join(', ');
      toast.error(errorMessage);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid username or password");
      } else {
        // Successful login, session is set
        toast.success("Login successful");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        action="/api/login"
        className="flex flex-col gap-4 mt-4"
      >
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
        <Button disabled={loading} type="submit" variant={"blue"}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </>
  );
};

export default Login;
