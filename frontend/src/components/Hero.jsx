import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Decorative glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold">
            ✨ AI Powered Learning Platform
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight">

            Learn Smarter.
            <br />

            Teach Better.
            <br />

            <span className="text-blue-500">
              Succeed Together.
            </span>

          </h1>

          {/* Description */}
          <p className="mt-8 max-w-3xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
            Generate quizzes instantly using AI, manage courses,
            monitor student performance and make learning smarter.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

            <button
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
  );
}