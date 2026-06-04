

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  if (import.meta.env.PROD) {
    return "";
  }
  
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiUrl();
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : "";

export const verifyApiConfig = () => {
  const mode = import.meta.env.MODE;
  const isProd = import.meta.env.PROD;
  
  console.log(`[Forge Links] Environment: ${mode}`);
  
  if (!API_BASE_URL) {
    if (isProd) {
      console.error("❌ CRITICAL: Production API URL is not configured. Set VITE_API_URL in your environment variables.");
    } else {
      console.warn("⚠️ Warning: API URL is not configured. Falling back to empty string.");
    }
  } else {
    console.log(`[Forge Links] API URL: ${API_URL}`);
  }
};

export default {
  BASE_URL: API_BASE_URL,
  API_URL: API_URL,
  verify: verifyApiConfig
};
