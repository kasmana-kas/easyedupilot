import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function StudentQuizzes() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [quiz, setQuiz] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =========================================================
  // SEARCH QUIZ BY SHARE CODE
  // =========================================================

  const findQuiz = async (event) => {

    event.preventDefault();

    const value = search.trim().toUpperCase();


    if (!value) {

      setError(
        "Please enter the quiz code given to you by your teacher."
      );

      return;
    }


    try {

      setLoading(true);
      setError("");
      setQuiz(null);


      console.log(
        "🔎 Searching for quiz:",
        value
      );


      const response = await api.get(
        `/quizzes/share/${value}`
      );


      console.log(
        "✅ Quiz found:",
        response.data
      );


      setQuiz(response.data);


    } catch (err) {

      console.error(
        "❌ Quiz search failed:",
        err
      );


      console.error(
        "Backend response:",
        err.response?.data
      );


      setError(
        err.response?.data?.detail ||
        "Quiz not found. Please check the code."
      );


    } finally {

      setLoading(false);

    }
  };


  return (

    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white">

        <div className="max-w-5xl mx-auto px-6 py-10">


          {/* HEADER */}

          <div className="mb-10">

            <p className="text-blue-400 font-semibold mb-2">
              Student Learning
            </p>


            <h1 className="text-4xl font-black">
              My Quizzes
            </h1>


            <p className="text-gray-400 mt-2">
              Enter the quiz code provided by your teacher
              to access your quiz.
            </p>

          </div>


          {/* SEARCH */}

          <form
            onSubmit={findQuiz}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
          >

            <label className="block text-sm font-semibold mb-3">
              Quiz Code
            </label>


            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. EDU-A7K92P"
                className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition font-bold tracking-wider"
              />


              <button
                type="submit"
                disabled={loading}
                className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold transition"
              >

                {loading
                  ? "Searching..."
                  : "🔎 Search Quiz"}

              </button>

            </div>


            <p className="text-sm text-gray-500 mt-3">
              Your teacher should provide this code
              after generating the quiz.
            </p>

          </form>


          {/* ERROR */}

          {error && (

            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>

          )}


          {/* FOUND QUIZ */}

          {quiz && (

            <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                <div>

                  <p className="text-blue-400 font-semibold mb-2">
                    Quiz Found
                  </p>


                  <h2 className="text-3xl font-black">
                    {quiz.title}
                  </h2>


                  <p className="text-gray-400 mt-2">
                    {quiz.subject} • {quiz.topic}
                  </p>

                </div>


                <div className="px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">

                  <p className="text-xs text-gray-400">
                    Quiz Code
                  </p>

                  <p className="font-black tracking-widest text-purple-400">
                    {quiz.share_code}
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-gray-400">
                    Subject
                  </p>

                  <p className="font-semibold mt-1">
                    {quiz.subject}
                  </p>
                </div>


                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-gray-400">
                    Topic
                  </p>

                  <p className="font-semibold mt-1">
                    {quiz.topic}
                  </p>
                </div>


                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-gray-400">
                    Questions
                  </p>

                  <p className="font-semibold mt-1">
                    {quiz.questions?.length || 0}
                  </p>
                </div>

              </div>


              <button
                onClick={() =>
                  navigate(
                    `/student/quiz/${quiz.id}`
                  )
                }
                className="mt-8 w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition"
              >
                Start Quiz →
              </button>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}