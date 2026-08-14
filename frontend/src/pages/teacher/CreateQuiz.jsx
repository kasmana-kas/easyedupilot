import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;

    setQuestions(
      questions.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];

    updated[index][field] = value;

    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];

    updated[questionIndex].options[optionIndex] = value;

    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a quiz title.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question.trim()) {
        setError(`Please enter question ${i + 1}.`);
        return;
      }

      if (q.options.some((option) => !option.trim())) {
        setError(`Please complete all options for question ${i + 1}.`);
        return;
      }

      if (!q.correct_answer.trim()) {
        setError(`Please select the correct answer for question ${i + 1}.`);
        return;
      }
    }

    try {
      setLoading(true);

      const response = await api.post("/quizzes/teacher/quizzes", {
        title,
        subject,
        topic,
        difficulty,
        questions,
      });

      console.log("Quiz created:", response.data);

      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Failed to create quiz:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to create quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-blue-400 font-semibold mb-2">
            Manual Quiz Creation
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Create Quiz ✍️
          </h1>

          <p className="text-gray-400 mt-2">
            Create your quiz manually by adding your own questions.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* QUIZ DETAILS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">

            <h2 className="text-xl font-bold mb-6">
              Quiz Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Quiz Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Python"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Topic
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Python Variables"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

            </div>

          </div>

          {/* QUESTIONS */}
          <div className="space-y-6">

            {questions.map((question, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-xl font-bold">
                    Question {index + 1}
                  </h2>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}

                </div>

                {/* QUESTION */}
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(
                      index,
                      "question",
                      e.target.value
                    )
                  }
                  placeholder="Enter your question..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500 mb-5"
                />

                {/* OPTIONS */}
                <div className="space-y-3">

                  {question.options.map((option, optionIndex) => {

                    const letter = String.fromCharCode(
                      65 + optionIndex
                    );

                    return (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-3"
                      >

                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold">
                          {letter}
                        </span>

                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${letter}`}
                          className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-blue-500"
                        />

                      </div>
                    );

                  })}

                </div>

                {/* CORRECT ANSWER */}
                <div className="mt-5">

                  <label className="block text-sm text-gray-400 mb-2">
                    Correct Answer
                  </label>

                  <select
                    value={question.correct_answer}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "correct_answer",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-green-500"
                  >

                    <option value="">
                      Select correct answer
                    </option>

                    <option value="A">
                      A
                    </option>

                    <option value="B">
                      B
                    </option>

                    <option value="C">
                      C
                    </option>

                    <option value="D">
                      D
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

          {/* ADD QUESTION */}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-6 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
          >
            + Add Question
          </button>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-4 mt-8">

            <button
              type="button"
              onClick={() => navigate("/teacher/dashboard")}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Creating Quiz..." : "Create Quiz"}
            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}