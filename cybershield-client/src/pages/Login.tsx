import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { login: saveToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError("");

      const response = await login(data);

      saveToken(response.token);

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">


        <Shield
            className="mx-auto text-cyan-600"
            size={52}
          />

        <h1 className="text-3xl font-bold text-center mb-2">
          CyberShield
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Security Dashboard Login
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;