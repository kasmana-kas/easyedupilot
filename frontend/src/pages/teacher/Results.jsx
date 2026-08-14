import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeacherResults() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/quizzes/teacher/quizzes");

      console.log("Teacher quizzes:", response.data);

      setQuizzes(response.data);
    } catch (err) {
      console.error("Failed to load teacher quizzes:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your quizzes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-purple-400 font-semibold mb-2">
            Teacher Performance
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Student Results 📊
          </h1>

          <p className="text-gray-400 mt-2">
            Select a quiz to view your students' performance.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl animate-bounce mb-6">
              📊
            </div>

            <h2 className="text-xl font-semibold">
              Loading quizzes...
            </h2>

            <p className="text-gray-500 mt-2">
              Getting your quizzes.
            </p>
          </div>
        ) : quizzes.length === 0 ? (
          /* EMPTY */
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-5">
              📝
            </div>

            <h2 className="text-2xl font-bold">
              No Quizzes Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Create a quiz first before viewing student results.
            </p>

            <button
              onClick={() =>
                navigate("/teacher/generate-quiz")
              }
              className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold"
            >
              🤖 Generate AI Quiz
            </button>

          </div>
        ) : (
          /* QUIZ LIST */
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">
                My Quizzes
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Choose a quiz to view student results.
              </p>
            </div>

            <div className="divide-y divide-white/10">

              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:bg-white/5 transition"
                >

                  <div>
                    <h3 className="text-lg font-bold">
                      {quiz.title}
                    </h3>

                    <p className="text-purple-400 text-sm mt-1">
                      {quiz.subject}
                    </p>

                    {quiz.topic && (
                      <p className="text-gray-500 text-sm mt-1">
                        Topic: {quiz.topic}
                      </p>
                    )}

                    {quiz.difficulty && (
                      <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 capitalize">
                        {quiz.difficulty}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/quizzes/${quiz.id}/results`
                      )
                    }
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
                  >
                    📊 View Student Results
                  </button>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}