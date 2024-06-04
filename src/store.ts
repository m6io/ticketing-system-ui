import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // For local development. This is just for demo purposes. Store in .env file.
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  username: string;
  password: string;
}

interface UserResponse {
  xata_id: string;
  username: string;
  token: string;
}

interface TicketComment {
  xata_id: string;
  user: string;
  username: string;
  ticket_comment_id: number;
  comment: string;
  comment_date: string;
}

export enum TicketStatus {
  OPEN = "O",
  CLOSED = "C",
}

interface Ticket {
  xata_id: string;
  user: string;
  ticket_id: number;
  title: string;
  description?: string;
  create_date: string;
  closed_date?: string;
  status: TicketStatus;
  comments: TicketComment[];
}

interface AuthState {
  isAuthenticated: boolean;
  tickets: Ticket[];
  currentTicket: Ticket | null;
  error: string | null;
  success: string | null;
  login: (user: User) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => void;
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;
  openTicket: (id: string) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  createTicket: (
    ticket: Partial<Ticket>,
    navigate: (path: string) => void
  ) => Promise<void>;
  updateTicket: (
    id: string,
    ticket: Partial<Ticket>,
    navigate: (path: string) => void
  ) => Promise<void>;
  commentOnTicket: (
    id: string,
    comment: Partial<TicketComment>
  ) => Promise<void>;
  verifyToken: () => Promise<void>;
  resetNotification: () => void;
  clearCurrentTicket: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  tickets: [],
  currentTicket: null,
  error: null,
  success: null,
  login: async (user: User) => {
    try {
      const response = await api.post<UserResponse>("/login", user);
      localStorage.setItem("token", response.data.token);
      set({ isAuthenticated: true, success: "", error: "" });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        success: "",
      });
    }
  },
  register: async (user: User) => {
    try {
      const response = await api.post<UserResponse>("/register", user);
      localStorage.setItem("token", response.data.token);
      set({
        isAuthenticated: true,
        success: "",
        error: "",
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        success: "",
      });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, success: "", error: "" });
  },
  fetchTickets: async () => {
    try {
      const response = await api.get<Ticket[]>("/tickets");
      set({
        tickets: response.data,
        success: "",
        error: "",
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch tickets",
        success: "",
      });
    }
  },
  fetchTicketById: async (id: string) => {
    try {
      const response = await api.get<Ticket>(`/tickets/${id}`);
      set({
        currentTicket: response.data,
        success: "",
        error: "",
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch ticket",
        success: "",
      });
    }
  },
  closeTicket: async (id: string) => {
    try {
      await api.post(`/tickets/${id}/close`);
      await useAuthStore.getState().fetchTickets();
      set({ success: "Ticket closed successfully", error: "" });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to close ticket",
        success: "",
      });
    }
  },
  openTicket: async (id: string) => {
    try {
      await api.post(`/tickets/${id}/open`);
      await useAuthStore.getState().fetchTickets();
      set({ success: "Ticket opened successfully", error: "" });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to open ticket",
        success: "",
      });
    }
  },
  deleteTicket: async (id: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.delete(`/tickets/${id}`);
        await useAuthStore.getState().fetchTickets();
        set({ success: "Ticket deleted successfully", error: "" });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to delete ticket",
          success: "",
        });
      }
    }
  },
  createTicket: async (
    ticket: Partial<Ticket>,
    navigate: (path: string) => void
  ) => {
    try {
      const response = await api.post("/tickets", ticket);
      await useAuthStore.getState().fetchTickets();
      set({ success: "Ticket created successfully", error: "" });
      navigate(`/tickets/${response.data.ticket_id}`);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create ticket",
        success: "",
      });
    }
  },
  updateTicket: async (
    id: string,
    ticket: Partial<Ticket>,
    navigate: (path: string) => void
  ) => {
    try {
      await api.put(`/tickets/${id}`, ticket);
      await useAuthStore.getState().fetchTickets();
      set({ success: "Ticket updated successfully", error: "" });
      navigate(`/tickets/${id}`);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update ticket",
        success: "",
      });
    }
  },
  commentOnTicket: async (id: string, comment: Partial<TicketComment>) => {
    try {
      await api.post(`/tickets/${id}/comments`, comment);
      await useAuthStore.getState().fetchTicketById(id);
      set({ success: "Comment added successfully", error: "" });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to comment on ticket",
        success: "",
      });
    }
  },
  verifyToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      await api.get("/tickets"); // Dummy request to verify token
      set({
        isAuthenticated: true,
        success: "",
        error: "",
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({ isAuthenticated: false, success: "", error: "" });
    }
  },
  resetNotification: () => set({ success: null, error: null }),
  clearCurrentTicket: () => set({ currentTicket: null }),
}));

export default useAuthStore;
