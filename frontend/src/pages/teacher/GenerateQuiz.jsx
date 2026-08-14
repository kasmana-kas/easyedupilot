import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function GenerateQuiz() {

  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    topic: "",
    difficulty: "medium",
    number_of_questions: 10,
  });


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // =========================================================
  // GENERATE QUIZ
  // =========================================================

  const handleGenerate = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");
    setGeneratedQuiz(null);


    if (!form.title.trim()) {
      setError("Please enter a quiz title.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!form.topic.trim()) {
      setError("Please enter the topic.");
      return;
    }


    const numberOfQuestions = Number(
      form.number_of_questions
    );


    if (
      numberOfQuestions < 1 ||
      numberOfQuestions > 50
    ) {

      setError(
        "Number of questions must be between 1 and 50."
      );

      return;
    }


    try {

      setGenerating(true);


      const payload = {

        title: form.title.trim(),

        subject: form.subject.trim(),

        topic: form.topic.trim(),

        difficulty: form.difficulty,

        number_of_questions:
          numberOfQuestions,
      };


      console.log(
        "🤖 Sending AI quiz request:",
        payload
      );


      const response = await api.post(
        "/quizzes/generate",
        payload
      );


      console.log(
        "✅ AI quiz response:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      setGeneratedQuiz(
        response.data
      );


      setSuccess(
        "🎉 Quiz generated successfully!"
      );


    } catch (err) {

      console.error(
        "❌ AI quiz generation failed:",
        err
      );


      console.error(
        "Backend response:",
        err.response?.data
      );


      setError(
        err.response?.data?.detail ||
        "Unable to generate quiz. Please try again."
      );


    } finally {

      setGenerating(false);

    }
  };


  // =========================================================
  // COPY SHARE CODE
  // =========================================================

  const copyShareCode = async () => {

    if (!generatedQuiz?.share_code) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        generatedQuiz.share_code
      );

      setSuccess(
        "✅ Quiz code copied to clipboard!"
      );

    } catch {

      setError(
        "Unable to copy quiz code."
      );
    }
  };


  return (

    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white">

        <div className="max-w-4xl mx-auto px-6 py-8">


          {/* HEADER */}

          <div className="mb-8">

            <button
              onClick={() =>
                navigate("/teacher/dashboard")
              }
              className="text-gray-400 hover:text-white mb-5 transition"
            >
              ← Back to Dashboard
            </button>


            <p className="text-purple-400 font-semibold mb-2">
              Teacher Tools
            </p>


            <h1 className="text-3xl md:text-4xl font-black">
              Generate AI Quiz 🤖
            </h1>


            <p className="text-gray-400 mt-2">
              Let AI create multiple-choice
              questions based on your topic
              and difficulty.
            </p>

          </div>


          {/* SUCCESS */}

          {success && (

            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
              {success}
            </div>

          )}


          {/* GENERATED QUIZ */}

          {generatedQuiz && (

            <div className="mb-8 p-6 md:p-8 rounded-3xl bg-green-500/10 border border-green-500/30">

              <h2 className="text-2xl font-bold text-green-400 mb-6">
                🎉 Quiz Created Successfully
              </h2>


              {/* TITLE */}

              <div className="mb-6">

                <p className="text-sm text-gray-400">
                  Quiz Title
                </p>

                <p className="text-lg font-semibold mt-1">
                  {generatedQuiz.title}
                </p>

              </div>


              {/* SHARE CODE */}

              <div>

                <p className="text-sm text-gray-400">
                  Student Quiz Code
                </p>


                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">

                  <span className="text-3xl font-black tracking-widest text-purple-400">
                    {generatedQuiz.share_code}
                  </span>


                  <button
                    type="button"
                    onClick={copyShareCode}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    📋 Copy Code
                  </button>

                </div>


                <p className="text-sm text-gray-400 mt-3">
                  Send this code to your students.
                  They can enter it on their Quiz
                  page to access this quiz.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setGeneratedQuiz(null)
                }
                className="mt-6 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Generate Another Quiz
              </button>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>

          )}


          {/* FORM */}

          <form
            onSubmit={handleGenerate}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
          >


            {/* TITLE */}

            <div className="mb-6">

              <label className="block text-sm font-semibold mb-2">
                Quiz Title
              </label>


              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Python Fundamentals Quiz"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
              />

            </div>


            {/* SUBJECT + TOPIC */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Subject
                </label>


                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold mb-2">
                  Topic
                </label>


                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. Python Variables"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />

              </div>

            </div>


            {/* DIFFICULTY + NUMBER */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Difficulty
                </label>


                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1120] border border-white/10 outline-none focus:border-purple-500 transition"
                >

                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold mb-2">
                  Number of Questions
                </label>


                <input
                  type="number"
                  name="number_of_questions"
                  min="1"
                  max="50"
                  value={form.number_of_questions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />

              </div>

            </div>


            {/* AI INFORMATION */}

            <div className="mb-8 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">

              <div className="flex gap-4">

                <div className="text-3xl">
                  🤖
                </div>


                <div>

                  <h3 className="font-semibold">
                    AI Quiz Generation
                  </h3>


                  <p className="text-sm text-gray-400 mt-1">
                    AI will generate multiple-choice
                    questions based on your topic and
                    selected difficulty. The generated
                    quiz and questions will be saved
                    automatically.
                  </p>

                </div>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4">

              <button
                type="button"
                onClick={() =>
                  navigate("/teacher/dashboard")
                }
                disabled={generating}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 transition"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={generating}
                className="flex-1 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 font-semibold transition"
              >

                {generating
                  ? "🤖 Generating Quiz..."
                  : "🤖 Generate Quiz"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}