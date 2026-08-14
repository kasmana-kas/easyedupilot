import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-blue-400"
        >
          EasyEduPilot
        </button>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <a
            href="#features"
            className="hover:text-white transition"
          >
            Features
          </a>

          <a
            href="#about"
            className="hover:text-white transition"
          >
            About
          </a>

          <a
            href="#testimonials"
            className="hover:text-white transition"
          >
            Testimonials
          </a>

        </div>

        {/* AUTH */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-gray-300 hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Register
          </button>

        </div>

      </div>
    </nav>
  );
}