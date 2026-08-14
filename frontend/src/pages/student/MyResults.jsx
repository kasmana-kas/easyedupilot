import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function MyResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📊 Loading student results...");

      const response = await api.get("/quizzes/student/results");

      console.log("✅ Results loaded:", response.data);

      setResults(response.data);

    } catch (err) {
      console.error("❌ Failed to load results:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your quiz results."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CALCULATE SUMMARY
  // =========================

  const totalQuizzes = results.length;

  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          results.reduce(
            (total, result) =>
              total + Number(result.percentage || 0),
            0
          ) / totalQuizzes
        )
      : 0;

  const passedQuizzes = results.filter(
    (result) => result.passed
  ).length;

  const failedQuizzes =
    totalQuizzes - passedQuizzes;

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-blue-400 font-semibold mb-2">
              Student Performance
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              My Results 📊
            </h1>

            <p className="text-gray-400 mt-2">
              Track your quiz performance and monitor your
              learning progress.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/student/quizzes")
            }
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
          >
            📝 Take a Quiz
          </button>

        </div>


        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>

        )}


        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading ? (

          <div className="flex flex-col items-center justify-center py-24">

            <div className="text-6xl animate-bounce mb-6">
              📊
            </div>

            <h2 className="text-xl font-semibold">
              Loading your results...
            </h2>

            <p className="text-gray-500 mt-2">
              Getting your latest quiz performance.
            </p>

          </div>

        ) : (

          <>
            {/* ========================= */}
            {/* SUMMARY CARDS */}
            {/* ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

              {/* TOTAL */}

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Quizzes Taken
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {totalQuizzes}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                    📝
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Total attempts
                </p>

              </div>


              {/* AVERAGE */}

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Average Score
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {averageScore}%
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                    📈
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Overall performance
                </p>

              </div>


              {/* PASSED */}

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Passed
                    </p>

                    <p className="text-3xl font-bold mt-2 text-green-400">
                      {passedQuizzes}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                    ✅
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Successful attempts
                </p>

              </div>


              {/* FAILED */}

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Needs Improvement
                    </p>

                    <p className="text-3xl font-bold mt-2 text-red-400">
                      {failedQuizzes}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl">
                    📚
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Quizzes to improve
                </p>

              </div>

            </div>


            {/* ========================= */}
            {/* EMPTY STATE */}
            {/* ========================= */}

            {results.length === 0 ? (

              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

                <div className="text-6xl mb-5">
                  📊
                </div>

                <h2 className="text-2xl font-bold">
                  No Results Yet
                </h2>

                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                  You haven't completed any quizzes yet.
                  Take your first quiz and your results will
                  appear here.
                </p>

                <button
                  onClick={() =>
                    navigate("/student/quizzes")
                  }
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
                >
                  📝 Find a Quiz
                </button>

              </div>

            ) : (

              /* ========================= */
              /* RESULTS TABLE */
              /* ========================= */

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

                <div className="p-6 border-b border-white/10">

                  <h2 className="text-xl font-bold">
                    Quiz History
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your completed quizzes and scores.
                  </p>

                </div>


                {/* DESKTOP TABLE */}

                <div className="hidden md:block overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-white/10 text-left">

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Quiz
                        </th>

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Subject
                        </th>

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Score
                        </th>

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Percentage
                        </th>

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Status
                        </th>

                        <th className="px-6 py-4 text-sm text-gray-500 font-medium">
                          Date
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {results.map((result, index) => (

                        <tr
                          key={`${result.quiz_id}-${index}`}
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >

                          <td className="px-6 py-5">

                            <p className="font-semibold">
                              {result.quiz_title}
                            </p>

                          </td>


                          <td className="px-6 py-5 text-gray-400">
                            {result.subject}
                          </td>


                          <td className="px-6 py-5">

                            <span className="font-semibold">
                              {result.score}
                            </span>

                            <span className="text-gray-500">
                              {" "}
                              / {result.total_questions}
                            </span>

                          </td>


                          <td className="px-6 py-5">

                            <span
                              className={`font-bold ${
                                result.passed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {result.percentage}%
                            </span>

                          </td>


                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                result.passed
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {result.passed
                                ? "Passed"
                                : "Failed"}
                            </span>

                          </td>


                          <td className="px-6 py-5 text-gray-500 text-sm">
                            {new Date(
                              result.submitted_at
                            ).toLocaleDateString()}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>


                {/* MOBILE CARDS */}

                <div className="md:hidden divide-y divide-white/10">

                  {results.map((result, index) => (

                    <div
                      key={`${result.quiz_id}-${index}`}
                      className="p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="font-semibold">
                            {result.quiz_title}
                          </h3>

                          <p className="text-sm text-blue-400 mt-1">
                            {result.subject}
                          </p>

                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.passed
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {result.passed
                            ? "Passed"
                            : "Failed"}
                        </span>

                      </div>


                      <div className="grid grid-cols-3 gap-3 mt-5">

                        <div>

                          <p className="text-xs text-gray-500">
                            Score
                          </p>

                          <p className="font-semibold mt-1">
                            {result.score}/{result.total_questions}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs text-gray-500">
                            Percentage
                          </p>

                          <p className="font-semibold mt-1">
                            {result.percentage}%
                          </p>

                        </div>


                        <div>

                          <p className="text-xs text-gray-500">
                            Date
                          </p>

                          <p className="font-semibold mt-1">
                            {new Date(
                              result.submitted_at
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </DashboardLayout>
  );
}