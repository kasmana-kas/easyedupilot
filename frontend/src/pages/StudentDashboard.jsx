import { useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050914] text-white">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="border-b border-white/10 bg-[#050914]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}

          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center"
          >
            <img
              src="/easyedupilot-logo.png"
              alt="EasyEduPilot"
              className="w-16 h-12 object-contain"
            />

            <span className="font-bold text-xl ml-2">
              EasyEduPilot
            </span>
          </button>

          {/* USER */}

          <div className="flex items-center gap-5">

            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold">
                {user?.first_name || "Student"}
              </p>

              <p className="text-xs text-gray-400">
                Student
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>


      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ========================= */}
        {/* WELCOME */}
        {/* ========================= */}

        <div className="mb-10">

          <p className="text-blue-400 font-semibold mb-2">
            Student Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Welcome back, {user?.first_name || "Student"} 👋
          </h1>

          <p className="text-gray-400 mt-3">
            Here's an overview of your learning progress.
          </p>

        </div>


        {/* ========================= */}
        {/* AI LEARNING MATERIAL */}
        {/* ========================= */}

        <section className="mb-10">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl">

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />

            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-white/5" />

            <div className="relative z-10">

              <div className="grid lg:grid-cols-2 gap-10 items-center">

                {/* TEXT */}

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
                      🤖
                    </div>

                    <span className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                      AI Study Assistant
                    </span>

                  </div>


                  <h2 className="text-3xl md:text-4xl font-bold">
                    Learn smarter with AI
                  </h2>


                  <p className="text-blue-100 mt-4 leading-7 max-w-xl">
                    Generate personalized study notes, summaries,
                    flashcards, study guides and simple explanations
                    for any topic you're learning.
                  </p>


                  {/* IMPORTANT BUTTON */}

                  <button
                    onClick={() => navigate("/student/ai-materials")}
                    className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
                  >
                    ✨ Generate Learning Material
                  </button>

                </div>


                {/* AI FEATURES */}

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <div className="text-3xl mb-3">
                      📝
                    </div>

                    <h3 className="font-semibold">
                      Smart Notes
                    </h3>

                    <p className="text-sm text-blue-100 mt-2">
                      Clear and easy-to-understand notes.
                    </p>
                  </div>


                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <div className="text-3xl mb-3">
                      🃏
                    </div>

                    <h3 className="font-semibold">
                      Flashcards
                    </h3>

                    <p className="text-sm text-blue-100 mt-2">
                      Quickly revise important concepts.
                    </p>
                  </div>


                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <div className="text-3xl mb-3">
                      📖
                    </div>

                    <h3 className="font-semibold">
                      Summaries
                    </h3>

                    <p className="text-sm text-blue-100 mt-2">
                      Get the most important ideas.
                    </p>
                  </div>


                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <div className="text-3xl mb-3">
                      💡
                    </div>

                    <h3 className="font-semibold">
                      Explanations
                    </h3>

                    <p className="text-sm text-blue-100 mt-2">
                      Simplify difficult topics.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ========================= */}
        {/* STAT CARDS */}
        {/* ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* COURSES */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-400">
              My Courses
            </p>

            <h2 className="text-4xl font-bold mt-3">
              4
            </h2>

            <p className="text-blue-400 text-sm mt-2">
              Active courses
            </p>

          </div>


          {/* QUIZZES */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-400">
              Quizzes Completed
            </p>

            <h2 className="text-4xl font-bold mt-3">
              12
            </h2>

            <p className="text-green-400 text-sm mt-2">
              Keep going!
            </p>

          </div>


          {/* SCORE */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-400">
              Average Score
            </p>

            <h2 className="text-4xl font-bold mt-3">
              78%
            </h2>

            <p className="text-yellow-400 text-sm mt-2">
              Good performance
            </p>

          </div>

        </div>


        {/* ========================= */}
        {/* QUICK ACTIONS */}
        {/* ========================= */}

        <div className="mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* AI MATERIAL */}

            <button
              onClick={() => navigate("/student/ai-materials")}
              className="text-left bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/40 transition group"
            >

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">
                🤖
              </div>

              <h3 className="font-semibold text-lg">
                Generate Study Material
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Create AI-powered notes, summaries,
                flashcards and study guides.
              </p>

              <p className="text-blue-400 text-sm font-medium mt-5">
                Start learning →
              </p>

            </button>


            {/* QUIZ */}

            <button
              onClick={() => navigate("/student/quizzes")}
              className="text-left bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/40 transition group"
            >

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">
                📝
              </div>

              <h3 className="font-semibold text-lg">
                Take a Quiz
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Test your knowledge and discover
                areas where you can improve.
              </p>

              <p className="text-purple-400 text-sm font-medium mt-5">
                Take quiz →
              </p>

            </button>


            {/* RESULTS */}

            <button
              onClick={() => navigate("/student/results")}
              className="text-left bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/40 transition group"
            >

              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">
                📊
              </div>

              <h3 className="font-semibold text-lg">
                View Results
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Track your quiz performance and
                monitor your learning progress.
              </p>

              <p className="text-green-400 text-sm font-medium mt-5">
                View results →
              </p>

            </button>

          </div>

        </div>


        {/* ========================= */}
        {/* RECENT QUIZZES */}
        {/* ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Recent Quizzes
              </h2>

              <button
                onClick={() => navigate("/student/quizzes")}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View all
              </button>

            </div>


            <div className="space-y-4">

              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">

                <div>
                  <h3 className="font-semibold">
                    Python Basics
                  </h3>

                  <p className="text-sm text-gray-400">
                    Programming
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-green-400 font-semibold">
                    85%
                  </p>

                  <p className="text-xs text-gray-500">
                    Completed
                  </p>

                </div>

              </div>


              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">

                <div>
                  <h3 className="font-semibold">
                    Database Systems
                  </h3>

                  <p className="text-sm text-gray-400">
                    Databases
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-yellow-400 font-semibold">
                    72%
                  </p>

                  <p className="text-xs text-gray-500">
                    Completed
                  </p>

                </div>

              </div>


              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">

                <div>

                  <h3 className="font-semibold">
                    Computer Networking
                  </h3>

                  <p className="text-sm text-gray-400">
                    Networking
                  </p>

                </div>

                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                >
                  Start
                </button>

              </div>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Your Progress
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Overall learning progress
            </p>


            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <span className="text-gray-400">
                  Progress
                </span>

                <span className="font-bold">
                  78%
                </span>

              </div>


              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "78%" }}
                />

              </div>

            </div>


            <div className="mt-8 pt-6 border-t border-white/10">

              <p className="text-gray-400 text-sm">
                Keep learning!
              </p>

              <p className="text-2xl font-bold mt-2">
                You're doing great 🚀
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}