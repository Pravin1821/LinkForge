import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
    : "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post("/auth/login", credentials);

export const register = (payload) => api.post("/auth/register", payload);

export const getUrls = () => api.get("/urls");

export const createUrl = (data) => api.post("/urls", data);

export const deleteUrl = (id) => api.delete(`/urls/${id}`);

export const getAnalytics = (id) => api.get(`/analytics/${id}`);

export default api;
