import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050914] text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <img
              src="/easyedupilot-logo.png"
              alt="EasyEduPilot"
              className="w-12 h-12 object-contain"
            />
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Register
            </button>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-24 text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm md:text-base font-semibold">
              ✨ AI Powered Learning Platform
            </div>

            {/* HEADING */}
            <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight tracking-tight">

              Learn Smarter.
              <br />

              Teach Better.
              <br />

              <span className="text-blue-500">
                Succeed Together.
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="max-w-3xl mx-auto mt-8 text-gray-400 text-lg md:text-xl leading-relaxed">
              Generate quizzes instantly using AI, manage courses,
              monitor student performance and make learning smarter.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
              >
                🚀 Get Started
              </button>

              <button
                className="border border-white/20 hover:border-blue-500 hover:bg-blue-500/10 px-8 py-4 rounded-xl font-semibold transition"
              >
                ▶ Watch Demo
              </button>

            </div>

          </motion.div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24"
      >

        <div className="text-center mb-14">

          <p className="text-blue-400 font-semibold">
            POWERFUL FEATURES
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Everything you need to learn better
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Built for students, teachers and modern classrooms.
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            icon="🤖"
            title="AI Quiz"
            text="Generate intelligent quizzes instantly using AI."
          />

          <FeatureCard
            icon="📊"
            title="Analytics"
            text="Track student performance and understand learning progress."
          />

          <FeatureCard
            icon="📚"
            title="Modules"
            text="Organize courses and learning materials in one place."
          />

          <FeatureCard
            icon="🏆"
            title="Leaderboard"
            text="Encourage students with friendly competition and rankings."
          />

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="border-t border-white/10 bg-[#080d1a]"
      >

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <p className="text-blue-400 font-semibold">
            WHY EASYEDUPILOT?
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Education powered by intelligence.
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-gray-400 text-lg leading-relaxed">
            EasyEduPilot combines artificial intelligence with powerful
            educational tools to help teachers create better learning
            experiences and help students learn more effectively.
          </p>

        </div>

      </section>


      {/* ================= TESTIMONIALS ================= */}
      <section
        id="testimonials"
        className="max-w-5xl mx-auto px-6 py-24 text-center"
      >

        <p className="text-blue-400 font-semibold">
          💬 WHAT PEOPLE SAY
        </p>

        <h2 className="text-4xl font-bold mt-3">
          Learning should be smarter.
        </h2>

        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">

          <div className="text-yellow-400 text-xl mb-5">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="text-gray-300 text-lg italic leading-relaxed">
            "EasyEduPilot makes creating quizzes and monitoring
            student performance simple and intelligent."
          </p>

          <p className="mt-5 text-blue-400 font-semibold">
            — EasyEduPilot User
          </p>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-3">

            <img
              src="/easyedupilot-logo.png"
              alt="EasyEduPilot"
              className="w-10 h-10 object-contain"
            />

            <span className="text-gray-400">
              © 2026 EasyEduPilot
            </span>

          </div>

          <div className="text-gray-500 text-sm">
            Learn Smarter. Teach Better. Succeed Together.
          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition"
    >

      <div className="text-4xl mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-gray-400 mt-3 leading-relaxed">
        {text}
      </p>

    </motion.div>
  );
}