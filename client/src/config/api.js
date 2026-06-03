/**
 * Centralized API configuration for Forge Links
 */

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  
  if (import.meta.env.PROD) {
    console.warn("VITE_API_URL is not defined in production environment variables. Requests will likely fail.");
  }
  
  // Fallback for development
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiUrl();
export const API_URL = `${API_BASE_URL}/api`;

export default {
  BASE_URL: API_BASE_URL,
  API_URL: API_URL,
};
