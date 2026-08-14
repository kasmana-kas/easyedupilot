import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.first_name || "Student";

  return (
  <DashboardLayout>

    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <p className="text-blue-400 font-semibold mb-2">
            Student Learning
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Available Quizzes 📝
          </h1>

          <p className="text-gray-400 mt-2">
            Search for quizzes created by your teachers.
          </p>
        </div>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          ← Dashboard
        </button>

      </div>


      {/* SEARCH */}
      <div className="mb-8">

        <label className="block text-sm font-semibold mb-2">
          Find a Quiz
        </label>

        <div className="relative">

          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            🔎
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter Quiz ID, title, subject, topic or share code..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition text-white placeholder-gray-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}

        </div>

        {!loading && (
          <p className="text-gray-500 text-sm mt-3">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </p>
        )}

      </div>


      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}


      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">

          <div className="text-5xl animate-bounce mb-5">
            📝
          </div>

          <p className="text-gray-400">
            Loading quizzes...
          </p>

        </div>
      )}


      {/* NO QUIZZES */}
      {!loading &&
        quizzes.length === 0 &&
        !error && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-5">
              📚
            </div>

            <h2 className="text-2xl font-bold">
              No quizzes available
            </h2>

            <p className="text-gray-500 mt-3">
              Your teacher hasn't created any quizzes yet.
            </p>

          </div>
        )}


      {/* SEARCH FOUND NOTHING */}
      {!loading &&
        quizzes.length > 0 &&
        filteredQuizzes.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-5">
              🔍
            </div>

            <h2 className="text-2xl font-bold">
              No quizzes found
            </h2>

            <p className="text-gray-500 mt-3">
              No quiz matches{" "}
              <span className="text-blue-400">
                "{search}"
              </span>
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-6 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              Clear Search
            </button>

          </div>
        )}


      {/* QUIZZES */}
      {!loading && filteredQuizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredQuizzes.map((quiz) => (

            <div
              key={quiz.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/40 transition"
            >

              {/* TOP */}
              <div className="flex items-start justify-between mb-5">

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  📝
                </div>

                <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 capitalize">
                  {quiz.difficulty}
                </span>

              </div>


              {/* QUIZ ID */}
              <div className="mb-3">

                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Quiz ID
                </p>

                <p className="text-blue-400 font-mono font-semibold">
                  #{quiz.id}
                </p>

              </div>


              {/* TITLE */}
              <h2 className="text-xl font-bold">
                {quiz.title}
              </h2>


              {/* SUBJECT */}
              <p className="text-blue-400 text-sm mt-2">
                {quiz.subject}
              </p>


              {/* TOPIC */}
              <p className="text-gray-500 text-sm mt-2">
                Topic: {quiz.topic}
              </p>


              {/* SHARE CODE */}
              {quiz.share_code && (
                <div className="mt-4">

                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Share Code
                  </p>

                  <p className="text-gray-300 font-mono text-sm mt-1">
                    {quiz.share_code}
                  </p>

                </div>
              )}


              {/* START */}
              <button
                onClick={() =>
                  navigate(`/student/quiz/${quiz.id}`)
                }
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
              >
                Start Quiz →
              </button>

            </div>

          ))}

        </div>
      )}

    </div>

  </DashboardLayout>
);
}