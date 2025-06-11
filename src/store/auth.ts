import { create } from "zustand";
import type { StateCreator } from "zustand";
import axios from "axios";

// Type for user object
export interface User {
  _id: string;
  username: string;
  email: string;
}

// Auth store state and actions
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

// Zustand store for authentication
export const useAuthStore = create<AuthState>((set: Parameters<StateCreator<AuthState>>[0]) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  // Login action: call backend, store token, fetch user
  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/mongo/auth/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ token });
      await useAuthStore.getState().fetchMe();
    } catch (err) {
      // Type-safe error handling
      if (axios.isAxiosError(err)) {
        set({ error: err.response?.data?.error || "Login failed" });
      } else {
        set({ error: "Login failed" });
      }
    } finally {
      set({ loading: false });
    }
  },

  // Logout: clear token and user
  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null, token: null });
  },

  // Fetch current user info from backend
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get("/mongo/user/me");
      set({ user: res.data.user });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({ error: err.response?.data?.error || "Failed to fetch user", user: null });
      } else {
        set({ error: "Failed to fetch user", user: null });
      }
    } finally {
      set({ loading: false });
    }
  },
})); 