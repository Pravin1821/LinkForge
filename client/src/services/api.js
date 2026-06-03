import axios from "axios";
import { API_URL } from "../config/api";

const api = axios.create({
  baseURL: API_URL,
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

export const updateProfile = (data) => api.put("/auth/profile", data);

export const updatePassword = (data) => api.put("/auth/password", data);

export const deleteAccount = () => api.delete("/auth/account");

export const getUrls = () => api.get("/urls");

export const createUrl = (data) => api.post("/urls", data);

export const updateUrl = (id, data) => api.put(`/urls/${id}`, data);

export const deleteUrl = (id) => api.delete(`/urls/${id}`);

export const getAnalytics = (id) => api.get(`/analytics/${id}`);

export const getWorkspaceAnalytics = () => api.get("/analytics/global");

export default api;
