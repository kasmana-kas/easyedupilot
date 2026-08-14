import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";


export default function TeacherDashboard() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {

    fetchTeacherDashboard();

  }, []);


  const fetchTeacherDashboard = async () => {

    try {

      setLoading(true);
      setError("");


      const [
        dashboardResponse,
        quizzesResponse
      ] = await Promise.all([

        api.get(
          "/quizzes/teacher/dashboard"
        ),

        api.get(
          "/quizzes/teacher/quizzes"
        )

      ]);


      console.log(
        "✅ Teacher dashboard:",
        dashboardResponse.data
      );


      console.log(
        "✅ Teacher quizzes:",
        quizzesResponse.data
      );


      setDashboard(
        dashboardResponse.data
      );


      setQuizzes(
        Array.isArray(
          quizzesResponse.data
        )
          ? quizzesResponse.data
          : []
      );


    } catch (err) {

      console.error(
        "❌ Failed to load teacher dashboard:",
        err
      );


      setError(
        err.response?.data?.detail ||
        "Unable to load teacher dashboard."
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">

          <div className="text-6xl animate-bounce mb-6">
            👨‍🏫
          </div>

          <h2 className="text-xl font-semibold">
            Loading teacher dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Getting your teaching statistics.
          </p>

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

        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">

            {error}

          </div>

          <button
            onClick={fetchTeacherDashboard}
            className="mt-5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // MAIN
  // =========================================================

  return (

    <DashboardLayout>

      <div className="max-w-7xl mx-auto px-6 py-10 text-white">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <p className="text-purple-400 font-semibold">
              Teacher Dashboard
            </p>

            <h1 className="text-4xl font-black mt-1">
              Welcome back
              {user?.first_name
                ? `, ${user.first_name}`
                : ""}
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your quizzes and monitor student performance.
            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/teacher/create-quiz")
              }
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              ➕ Create Quiz
            </button>


            <button
              onClick={() =>
                navigate("/teacher/generate-quiz")
              }
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold"
            >
              🤖 AI Quiz
            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Total Quizzes
            </p>

            <p className="text-4xl font-black mt-2">
              {dashboard?.total_quizzes ?? 0}
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Total Attempts
            </p>

            <p className="text-4xl font-black mt-2">
              {dashboard?.total_attempts ?? 0}
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Average Score
            </p>

            <p className="text-4xl font-black mt-2">
              {dashboard?.average_score ?? 0}%
            </p>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Pass Rate
            </p>

            <p className="text-4xl font-black mt-2">
              {dashboard?.pass_rate ?? 0}%
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* QUIZZES */}
        {/* ================================================= */}

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-white/10">

            <h2 className="text-2xl font-bold">
              My Quizzes
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View quizzes, copy student codes and monitor results.
            </p>

          </div>


          {quizzes.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-6xl mb-5">
                📝
              </div>

              <h3 className="text-xl font-bold">
                No quizzes yet
              </h3>

              <p className="text-gray-500 mt-2">
                Create or generate your first quiz.
              </p>


              <div className="flex justify-center gap-3 mt-6">

                <button
                  onClick={() =>
                    navigate("/teacher/create-quiz")
                  }
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  Create Quiz
                </button>


                <button
                  onClick={() =>
                    navigate("/teacher/generate-quiz")
                  }
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold"
                >
                  Generate AI Quiz
                </button>

              </div>

            </div>

          ) : (

            <div className="divide-y divide-white/10">

              {quizzes.map(
                (quiz) => (

                  <div
                    key={quiz.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:bg-white/5 transition"
                  >

                    {/* QUIZ INFO */}

                    <div className="flex-1">

                      <h3 className="text-xl font-bold">
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


                      {/* SHARE CODE */}

                      <div className="mt-4 inline-flex flex-col bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">

                        <span className="text-xs text-blue-400 uppercase tracking-wider">
                          Student Quiz Code
                        </span>

                        <span className="text-lg font-black tracking-widest mt-1">
                          {quiz.share_code}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          navigate(
                            `/teacher/quizzes/${quiz.id}`
                          )
                        }
                        className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 font-semibold"
                      >
                        👁 View Quiz
                      </button>


                      <button
                        onClick={() =>
                          navigate(
                            `/teacher/quizzes/${quiz.id}/results`
                          )
                        }
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
                      >
                        📊 Results
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* LOGOUT */}
        {/* ================================================= */}

        <div className="mt-10">

          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
          >
            Logout
          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}