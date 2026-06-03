/**
 * Centralized API configuration for Forge Links
 */

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  
  // Fallback for development if no env var is provided
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiUrl();
export const API_URL = `${API_BASE_URL}/api`;

export default {
  BASE_URL: API_BASE_URL,
  API_URL: API_URL,
};
