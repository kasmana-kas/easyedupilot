import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);

      // Send users to the appropriate dashboard
        if (user.role === "teacher") {
        navigate("/teacher/dashboard");
        } else {
        navigate("/student/dashboard");
        }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/easyedupilot-logo.png"
            alt="EasyEduPilot"
            className="w-20 h-20 object-contain mx-auto"
          />

          <h1 className="text-3xl font-bold mt-4">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2">
            Login to your EasyEduPilot account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Username / Email
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Register
            </Link>
          </p>

        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-white transition"
          >
            ← Back to EasyEduPilot
          </Link>
        </div>

      </div>
    </div>
  );
}