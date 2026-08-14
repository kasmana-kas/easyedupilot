import { useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AIMaterials() {
  const [topic, setTopic] = useState("");
  const [materialType, setMaterialType] = useState("notes");
  const [difficulty, setDifficulty] = useState("beginner");

  const [material, setMaterial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateMaterial = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");
    setMaterial("");

    try {
      console.log("📤 Sending AI material request...");

      const response = await api.post("/ai/materials/generate", {
        topic: topic,
        material_type: materialType,
        difficulty: difficulty,
      });

      console.log("✅ AI response:", response.data);

      /*
       * The backend may return the generated material
       * under different property names.
       */
      const generated =
        response.data.material ||
        response.data.content ||
        response.data.learning_material ||
        response.data.result ||
        response.data;

      setMaterial(
        typeof generated === "string"
          ? generated
          : JSON.stringify(generated, null, 2)
      );

    } catch (err) {
      console.error("❌ AI MATERIAL ERROR:", err);

      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error("RESPONSE:", err.response.data);

        setError(
          err.response.data?.detail ||
            "The AI could not generate the material."
        );
      } else {
        setError(
          "Could not connect to the AI service. Make sure the backend and Ollama are running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <DashboardLayout>
    <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">

        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">
            🤖
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              AI Study Assistant
            </h1>

            <p className="text-gray-400 mt-1">
              Generate personalized learning materials with AI.
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* GENERATOR PANEL */}
        <div className="lg:col-span-1">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-semibold mb-6">
              Create Study Material
            </h2>

            <form
              onSubmit={generateMaterial}
              className="space-y-5"
            >

              {/* Topic */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  What do you want to study?
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Computer Networks"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Material type */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Material Type
                </label>

                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 outline-none focus:border-blue-500"
                >
                  <option value="notes">
                    📝 Study Notes
                  </option>

                  <option value="summary">
                    📖 Summary
                  </option>

                  <option value="flashcards">
                    🃏 Flashcards
                  </option>

                  <option value="study_guide">
                    🎯 Study Guide
                  </option>

                  <option value="explanation">
                    💡 Simple Explanation
                  </option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 outline-none focus:border-blue-500"
                >
                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Generate */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold transition"
              >
                {loading
                  ? "🤖 AI is generating..."
                  : "✨ Generate Material"}
              </button>

            </form>

          </div>

          {/* Feature cards */}
          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">📝</div>
              <p className="font-medium">Smart Notes</p>
              <p className="text-xs text-gray-500 mt-1">
                Easy-to-understand notes
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">🃏</div>
              <p className="font-medium">Flashcards</p>
              <p className="text-xs text-gray-500 mt-1">
                Quick revision
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-medium">Study Guide</p>
              <p className="text-xs text-gray-500 mt-1">
                Structured learning
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">💡</div>
              <p className="font-medium">AI Explanation</p>
              <p className="text-xs text-gray-500 mt-1">
                Simplified concepts
              </p>
            </div>

          </div>

        </div>

        {/* GENERATED MATERIAL */}
        <div className="lg:col-span-2">

          <div className="bg-white/5 border border-white/10 rounded-2xl min-h-[600px] shadow-xl">

            {/* Header */}
            <div className="border-b border-white/10 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    📚 Learning Material
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your AI-generated study content will appear here.
                  </p>
                </div>

                {material && (
  <div className="flex items-center gap-2">

    {/* COPY */}
    <button
      onClick={() =>
        navigator.clipboard.writeText(material)
      }
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition"
    >
      📋 Copy
    </button>

    {/* DOWNLOAD */}
    <button
      onClick={() => {
        const blob = new Blob([material], {
          type: "text/plain;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${topic || "AI-Study-Material"}.txt`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }}
      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm transition"
    >
      ⬇️ Download
    </button>

  </div>
)}

              </div>

            </div>

            {/* Body */}
            <div className="p-6">

              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[450px]">

                  <div className="text-5xl animate-bounce mb-6">
                    🤖
                  </div>

                  <h3 className="text-xl font-semibold">
                    Your AI tutor is thinking...
                  </h3>

                  <p className="text-gray-500 mt-2 text-center max-w-md">
                    We're creating personalized learning material
                    for you.
                  </p>

                </div>
              )}

              {!loading && !material && (
                <div className="flex flex-col items-center justify-center min-h-[450px] text-center">

                  <div className="text-6xl mb-6">
                    📚
                  </div>

                  <h3 className="text-2xl font-semibold">
                    Ready to Learn?
                  </h3>

                  <p className="text-gray-500 mt-3 max-w-md">
                    Enter a topic, choose the type of material
                    you want, and let EasyEduPilot's AI create it
                    for you.
                  </p>

                </div>
              )}

              {!loading && material && (
                <div className="prose prose-invert max-w-none">

                  <div className="whitespace-pre-wrap leading-8 text-gray-200">
                    {material}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  </DashboardLayout>
);
}