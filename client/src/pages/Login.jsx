import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../hooks/useAuth";
import { isAuthenticated } from "../lib/authStorage";

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="login"
      title="Welcome back"
      subtitle="Enter your credentials to open your workspace."
      footer={
        <p className="text-center text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--accent)]"
          >
            Create account
          </Link>
        </p>
      }
    >
      <AuthForm
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@gmail.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Your password",
          },
        ]}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Sign in"
      />
    </AuthLayout>
  );
}
