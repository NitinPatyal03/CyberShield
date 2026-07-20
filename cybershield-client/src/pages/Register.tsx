import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">
          <Shield
            className="mx-auto text-cyan-600"
            size={52}
          />

          <h1 className="text-3xl font-bold mt-4">
            CyberShield
          </h1>

          <p className="text-slate-500 mt-2">
            Create your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* First Name */}
          <div className="relative">
            <User
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <User
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border pl-10 pr-12 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-cyan-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}