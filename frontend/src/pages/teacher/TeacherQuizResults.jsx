import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeacherQuizResults() {

  const { quizId } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD RESULTS
  // =========================================================

  useEffect(() => {

    if (quizId) {
      fetchResults();
    }

  }, [quizId]);


  const fetchResults = async () => {

    try {

      setLoading(true);
      setError("");


      console.log(
        "📊 Loading teacher results for quiz:",
        quizId
      );


      const response = await api.get(
        `/quizzes/teacher/quizzes/${quizId}/results`
      );


      console.log(
        "✅ Teacher results:",
        response.data
      );


      setResults(
        Array.isArray(response.data)
          ? response.data
          : []
      );


    } catch (err) {

      console.error(
        "❌ Failed to load teacher results:",
        err
      );


      console.error(
        "Status:",
        err.response?.status
      );


      console.error(
        "Response:",
        err.response?.data
      );


      setError(
        err.response?.data?.detail ||
        "Unable to load quiz results."
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // SUMMARY
  // =========================================================

  const totalAttempts = results.length;


  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce(
            (total, result) =>
              total +
              Number(
                result.percentage ?? 0
              ),
            0
          ) / totalAttempts
        )
      : 0;


  const passedStudents =
    results.filter(
      (result) => result.passed
    ).length;


  const failedStudents =
    totalAttempts - passedStudents;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="min-h-[70vh] flex flex-col items-center justify-center">

          <div className="text-6xl animate-bounce mb-6">
            📊
          </div>

          <h2 className="text-xl font-semibold">
            Loading student results...
          </h2>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <DashboardLayout>

        <div className="max-w-5xl mx-auto px-6 py-8">

          <button
            onClick={() =>
              navigate("/teacher/dashboard")
            }
            className="text-gray-400 hover:text-white mb-6"
          >
            ← Back to Dashboard
          </button>


          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
            {error}
          </div>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* BACK */}

        <button
          onClick={() =>
            navigate(
              `/teacher/quizzes/${quizId}`
            )
          }
          className="text-gray-400 hover:text-white mb-6"
        >
          ← Back to Quiz
        </button>


        {/* HEADER */}

        <div className="mb-8">

          <p className="text-blue-400 font-semibold">
            Teacher Results
          </p>

          <h1 className="text-3xl md:text-4xl font-black mt-1">
            Student Performance
          </h1>

          <p className="text-gray-500 mt-2">
            Results for quiz #{quizId}
          </p>

        </div>


        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Total Attempts
            </p>

            <p className="text-3xl font-black mt-2">
              {totalAttempts}
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Average Score
            </p>

            <p className="text-3xl font-black mt-2">
              {averageScore}%
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Passed
            </p>

            <p className="text-3xl font-black text-green-400 mt-2">
              {passedStudents}
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Failed
            </p>

            <p className="text-3xl font-black text-red-400 mt-2">
              {failedStudents}
            </p>

          </div>

        </div>


        {/* NO RESULTS */}

        {results.length === 0 ? (

          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-5">
              📊
            </div>

            <h2 className="text-2xl font-bold">
              No Student Results Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Students haven't completed this quiz yet.
            </p>

          </div>

        ) : (

          /* RESULTS TABLE */

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-white/10">

              <h2 className="text-xl font-bold">
                Student Results
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Performance of students who completed this quiz.
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-white/10 text-left">

                    <th className="px-6 py-4 text-sm text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-sm text-gray-500">
                      Score
                    </th>

                    <th className="px-6 py-4 text-sm text-gray-500">
                      Percentage
                    </th>

                    <th className="px-6 py-4 text-sm text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm text-gray-500">
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {results.map(
                    (result, index) => {

                      const percentage =
                        Number(
                          result.percentage ?? 0
                        );


                      return (

                        <tr
                          key={
                            result.id ??
                            `${result.email}-${index}`
                          }
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >

                          {/* STUDENT */}

                          <td className="px-6 py-5">

                            <p className="font-semibold">
                              {result.student_name ||
                                "Student"}
                            </p>

                            {result.email && (

                              <p className="text-xs text-gray-500 mt-1">
                                {result.email}
                              </p>

                            )}

                          </td>


                          {/* SCORE */}

                          <td className="px-6 py-5">

                            <span className="font-semibold">
                              {result.score ?? 0}
                            </span>

                            <span className="text-gray-500">
                              {" "}
                              /{" "}
                              {result.total_questions ?? 0}
                            </span>

                          </td>


                          {/* PERCENTAGE */}

                          <td className="px-6 py-5">

                            <span
                              className={`font-bold ${
                                result.passed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {percentage}%
                            </span>

                          </td>


                          {/* STATUS */}

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


                          {/* DATE */}

                          <td className="px-6 py-5 text-gray-500 text-sm">

                            {result.submitted_at
                              ? new Date(
                                  result.submitted_at
                                ).toLocaleDateString()
                              : "—"}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}