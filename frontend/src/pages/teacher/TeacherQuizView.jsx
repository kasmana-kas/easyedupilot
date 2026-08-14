import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeacherQuizView() {

  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD TEACHER QUIZ
  // =========================================================

  useEffect(() => {

    if (quizId) {
      fetchQuiz();
    }

  }, [quizId]);


  const fetchQuiz = async () => {

    try {

      setLoading(true);
      setError("");

      console.log(
        "📖 Loading teacher quiz:",
        quizId
      );


      const response = await api.get(
        `/quizzes/teacher/quizzes/${quizId}`
      );


      console.log(
        "✅ Teacher quiz loaded:",
        response.data
      );


      setQuiz(response.data);


    } catch (err) {

      console.error(
        "❌ Unable to load teacher quiz:",
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
        "Unable to load quiz."
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">

          <div className="text-6xl animate-bounce mb-6">
            📖
          </div>

          <h2 className="text-xl font-semibold">
            Loading quiz...
          </h2>

          <p className="text-gray-500 mt-2">
            Getting the quiz questions.
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

        <div className="max-w-4xl mx-auto px-6 py-8">

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
  // QUIZ NOT FOUND
  // =========================================================

  if (!quiz) {

    return (

      <DashboardLayout>

        <div className="max-w-4xl mx-auto px-6 py-12 text-center">

          <h2 className="text-2xl font-bold">
            Quiz not found.
          </h2>

          <button
            onClick={() =>
              navigate("/teacher/dashboard")
            }
            className="mt-6 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </DashboardLayout>

    );

  }


  const questions = quiz.questions || [];


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <DashboardLayout>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/teacher/dashboard")
          }
          className="text-gray-400 hover:text-white mb-6 transition"
        >
          ← Back to Dashboard
        </button>


        {/* ================================================= */}
        {/* QUIZ HEADER */}
        {/* ================================================= */}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div className="flex-1">

              <p className="text-purple-400 font-semibold mb-2">
                Teacher Quiz
              </p>

              <h1 className="text-3xl md:text-4xl font-black">
                {quiz.title}
              </h1>


              <div className="flex flex-wrap gap-3 mt-5">

                {quiz.subject && (

                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                    {quiz.subject}
                  </span>

                )}


                {quiz.topic && (

                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
                    Topic: {quiz.topic}
                  </span>

                )}


                {quiz.difficulty && (

                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm capitalize">
                    {quiz.difficulty}
                  </span>

                )}

              </div>

            </div>


            {/* ================================================= */}
            {/* SHARE CODE */}
            {/* ================================================= */}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 min-w-[230px]">

              <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Student Quiz Code
              </p>

              <p className="text-2xl font-black tracking-widest mt-2 text-white">
                {quiz.share_code}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Share this code with your students.
              </p>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* QUESTIONS */}
        {/* ================================================= */}

        <div className="space-y-6">

          <div>

            <h2 className="text-2xl font-bold">
              Quiz Questions
            </h2>

            <p className="text-gray-500 mt-1">
              {questions.length} question
              {questions.length !== 1 ? "s" : ""}
            </p>

          </div>


          {questions.length === 0 ? (

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">

              <p className="text-gray-400">
                This quiz has no questions.
              </p>

            </div>

          ) : (

            questions.map(
              (question, index) => (

                <div
                  key={question.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >

                  <div className="flex gap-4">

                    <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">

                      <h3 className="text-lg font-semibold">
                        {question.question}
                      </h3>


                      <div className="grid md:grid-cols-2 gap-3 mt-5">

                        {[
                          ["A", question.option_a],
                          ["B", question.option_b],
                          ["C", question.option_c],
                          ["D", question.option_d],
                        ].map(
                          ([letter, text]) => (

                            <div
                              key={letter}
                              className="p-4 rounded-xl bg-white/5 border border-white/10"
                            >

                              <span className="font-bold text-purple-400 mr-3">
                                {letter}.
                              </span>

                              <span className="text-gray-300">
                                {text}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>


        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="flex flex-wrap gap-3 mt-8">

          <button
            onClick={() =>
              navigate(
                `/teacher/quizzes/${quizId}/results`
              )
            }
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
          >
            📊 View Student Results
          </button>


          <button
            onClick={() =>
              navigate("/teacher/dashboard")
            }
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition"
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}