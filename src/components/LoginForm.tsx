import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Login form component using Zustand for authentication
export function LoginForm() {
  // State for username and password fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login); // Use login action from Zustand store
  const error = useAuthStore((s) => s.error); // Zustand error state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Always use the current state values for username and password
    if (!username || !password) {
      // This is a local validation error, not from Zustand
      alert("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      await login(username, password); // Use Zustand login action
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-sm mx-auto mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <Input
        placeholder="Username"
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <Input
        placeholder="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {/* Error message from Zustand store */}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
} 