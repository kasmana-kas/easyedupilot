import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  // =========================================================
  // LOAD QUIZ
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

      console.log("=================================");
      console.log("📥 LOADING QUIZ");
      console.log("Quiz URL ID:", quizId);

      const response = await api.get(
        `/quizzes/${quizId}`
      );

      console.log("✅ Quiz response:", response.data);
      console.log("Quiz ID:", response.data?.id);
      console.log(
        "Share code:",
        response.data?.share_code
      );
      console.log(
        "Questions:",
        response.data?.questions?.length
      );

      setQuiz(response.data);

    } catch (err) {
      console.error(
        "❌ QUIZ LOAD ERROR:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load quiz. Please check the quiz code and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const handleAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNext = () => {
    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // =========================================================
  // SUBMIT QUIZ
  // =========================================================

    const handleSubmit = async () => {
    if (!quiz) {
        return;
    }

    try {
        setSubmitting(true);
        setError("");

        console.log("=================================");
        console.log("📤 SUBMITTING QUIZ");
        console.log("Quiz ID:", quiz.id);
        console.log("Answers:", answers);

        // Make sure we have an answer for every question
        const unansweredQuestions = quiz.questions.filter(
        (question) => !answers[question.id]
        );

        if (unansweredQuestions.length > 0) {
        setError(
            `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`
        );

        setSubmitting(false);
        return;
        }

        const submission = {
        answers: quiz.questions.map((question) => ({
            question_id: question.id,
            selected_answer: answers[question.id],
        })),
        };

        console.log(
        "📦 Submission payload:",
        JSON.stringify(submission, null, 2)
        );

        const response = await api.post(
        `/quizzes/${quiz.id}/submit`,
        submission
        );

        console.log(
        "✅ QUIZ SUBMISSION RESPONSE:",
        response.data
        );

        setResult(response.data);

        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });

    } catch (err) {
        console.error(
        "❌ QUIZ SUBMISSION ERROR:",
        err
        );

        console.error(
        "Status:",
        err.response?.status
        );

        console.error(
        "Backend response:",
        err.response?.data
        );

        setError(
        err.response?.data?.detail ||
        "Unable to submit quiz. Please try again."
        );

    } finally {
        setSubmitting(false);
    }
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#050914] text-white flex items-center justify-center">

          <div className="text-center">

            <div className="text-5xl mb-4">
              📚
            </div>

            <h2 className="text-2xl font-bold">
              Loading Quiz...
            </h2>

            <p className="text-gray-400 mt-2">
              Please wait while we load your quiz.
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // QUIZ LOAD ERROR
  // =========================================================

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#050914] text-white flex items-center justify-center px-6">

          <div className="text-center max-w-lg">

            <div className="text-6xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold">
              Unable to load quiz
            </h2>

            <p className="text-red-400 mt-3">
              {error}
            </p>

            <button
              onClick={() =>
                navigate("/student/quizzes")
              }
              className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
            >
              ← Back to Quizzes
            </button>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // RESULT PAGE
  // =========================================================

  if (result) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#050914] text-white px-6 py-10">

          <div className="max-w-5xl mx-auto">

            {/* RESULT HEADER */}

            <div className="text-center mb-10">

              <div className="text-6xl mb-4">
                {result.passed ? "🎉" : "📚"}
              </div>

              <h1 className="text-4xl font-black">
                Quiz Completed
              </h1>

              <p className="text-gray-400 mt-2">
                {quiz.title}
              </p>

            </div>

            {/* SCORE */}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

                <div>
                  <p className="text-gray-400">
                    Score
                  </p>

                  <p className="text-4xl font-black mt-2">
                    {result.correct_answers}/
                    {result.total_questions}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Percentage
                  </p>

                  <p className="text-4xl font-black mt-2">
                    {result.score_percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Result
                  </p>

                  <p
                    className={`text-2xl font-black mt-3 ${
                      result.passed
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.passed
                      ? "PASSED"
                      : "FAILED"}
                  </p>
                </div>

              </div>

            </div>

            {/* REVIEW */}

            <div className="mb-8">

              <h2 className="text-2xl font-bold mb-5">
                Question Review
              </h2>

              <div className="space-y-5">

                {result.review?.map(
                  (item, index) => (
                    <div
                      key={item.question_id}
                      className={`rounded-2xl border p-6 ${
                        item.is_correct
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >

                      <div className="flex justify-between gap-4 mb-4">

                        <h3 className="font-semibold">
                          {index + 1}.{" "}
                          {item.question}
                        </h3>

                        <span
                          className={
                            item.is_correct
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {item.is_correct
                            ? "✓ Correct"
                            : "✗ Incorrect"}
                        </span>

                      </div>

                      <div className="space-y-2 text-sm">

                        <p>
                          <span className="text-gray-400">
                            Your answer:
                          </span>{" "}
                          {item.selected_answer ||
                            "Not answered"}
                        </p>

                        <p>
                          <span className="text-gray-400">
                            Correct answer:
                          </span>{" "}
                          {item.correct_answer}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() =>
                  navigate("/student/results")
                }
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
              >
                View My Results
              </button>

              <button
                onClick={() =>
                  navigate("/student/quizzes")
                }
                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-semibold"
              >
                Find Another Quiz
              </button>

            </div>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const question =
    quiz.questions[currentQuestion];

  const selectedAnswer =
    answers[question.id];

  // =========================================================
  // QUIZ PAGE
  // =========================================================

  return (
    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white px-6 py-8">

        <div className="max-w-4xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <button
              onClick={() =>
                navigate("/student/quizzes")
              }
              className="text-gray-400 hover:text-white mb-5"
            >
              ← Back to Quizzes
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <p className="text-blue-400 font-semibold">
                  {quiz.subject}
                </p>

                <h1 className="text-3xl font-black">
                  {quiz.title}
                </h1>

                <p className="text-gray-400 mt-1">
                  {quiz.topic}
                </p>

              </div>

              <div className="text-sm text-gray-400">
                Quiz Code:
                <span className="ml-2 text-purple-400 font-bold">
                  {quiz.share_code}
                </span>
              </div>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="mb-6">

            <div className="flex justify-between text-sm text-gray-400 mb-2">

              <span>
                Question {currentQuestion + 1} of{" "}
                {quiz.questions.length}
              </span>

              <span>
                {Math.round(
                  ((currentQuestion + 1) /
                    quiz.questions.length) *
                    100
                )}
                %
              </span>

            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      quiz.questions.length) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {/* QUESTION */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">

            <div className="mb-8">

              <p className="text-sm text-gray-400 mb-3">
                Question {currentQuestion + 1}
              </p>

              <h2 className="text-2xl font-bold leading-relaxed">
                {question.question}
              </h2>

            </div>

            {/* OPTIONS */}

            <div className="space-y-4">

              {[
                ["A", question.option_a],
                ["B", question.option_b],
                ["C", question.option_c],
                ["D", question.option_d],
              ].map(
                ([letter, text]) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() =>
                      handleAnswer(
                        question.id,
                        letter
                      )
                    }
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      selectedAnswer === letter
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          selectedAnswer === letter
                            ? "bg-blue-600"
                            : "bg-white/10"
                        }`}
                      >
                        {letter}
                      </span>

                      <span className="flex-1">
                        {text}
                      </span>

                    </div>

                  </button>
                )
              )}

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">

              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30"
              >
                ← Previous
              </button>

              {currentQuestion <
              quiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Quiz"}
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}