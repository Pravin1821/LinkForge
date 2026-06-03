import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login as loginApi, register as registerApi } from "../services/api";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setAuth,
} from "../lib/authStorage";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser);
  const token = getToken();

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    navigate("/login", { replace: true });
    toast.success("Signed out successfully");
  }, [navigate]);

  const login = useCallback(
    async (credentials) => {
      const { data } = await loginApi(credentials);
      setAuth({ token: data.token, user: data.user });
      setUser(data.user);
      toast.success("Welcome back!", { description: "Login successful" });
      navigate("/", { replace: true });
      return data;
    },
    [navigate],
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await registerApi(payload);
      setAuth({ token: data.token, user: data.user });
      setUser(data.user);
      toast.success("Account created!", {
        description: "You're now signed in",
      });
      navigate("/", { replace: true });
      return data;
    },
    [navigate],
  );

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
