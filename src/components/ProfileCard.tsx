import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ProfileCard component displays and allows editing of user profile information
export function ProfileCard() {
  const { user, fetchMe, logout } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null); // Session error state
  const [loggedOut, setLoggedOut] = useState(false); // Track logout state
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token); // Always define token at the top

  // Check session on mount
  useEffect(() => {
    if (loggedOut) return; // Don't check session if logged out
    const token = useAuthStore.getState().token;
    fetch("/mongo/user/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setSessionError("Session expired. Please log in again.");
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 1500);
          return;
        }
        if (!res.ok) {
          setSessionError("Failed to fetch user.");
          return;
        }
        // Optionally update user state here if needed
      });
  }, [logout, navigate, token, loggedOut]);

  // Update user info
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/mongo/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ username, email }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      setSuccess("Profile updated!");
      await fetchMe();
    } catch (err) {
      setError((err as Error).message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/mongo/user/delete", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      logout();
      setLoggedOut(true);
    } catch (err) {
      setError((err as Error).message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (loggedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-green-600 font-bold mb-4">You have been logged out.</div>
        <div className="flex gap-4">
          <Button asChild variant="outline"><Link to="/">Go Home</Link></Button>
          <Button asChild><Link to="/login">Go to Login</Link></Button>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-600 font-bold mb-4">{sessionError}</div>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  if (!user) return <div className="mt-8 text-center">Loading...</div>;

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Update Profile"}
          </Button>
        </form>
        <hr className="my-6" />
        <Button variant="destructive" onClick={handleDelete} disabled={loading} className="w-full">
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
} 