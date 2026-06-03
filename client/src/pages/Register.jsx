import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../hooks/useAuth";
import { isAuthenticated } from "../lib/authStorage";

export default function Register() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      await register(formData);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="register"
      title="Create your account"
      subtitle="Free to start — you'll be in your dashboard right after signup."
      footer={
        <p className="text-center text-sm text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--accent)]"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthForm
        fields={[
          {
            name: "name",
            label: "Full name",
            type: "text",
            placeholder: "Pravin S",
          },
          {
            name: "email",
            label: "Work email",
            type: "email",
            placeholder: "you@gmail.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "At least 6 characters",
          },
        ]}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Create account"
      />
      <p className="mt-5 text-center text-[11px] leading-relaxed text-tertiary">
        By creating an account you agree to use Forge Links responsibly.
      </p>
    </AuthLayout>
  );
}
