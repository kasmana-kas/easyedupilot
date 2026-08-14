import { useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function SharedNote() {
  const [shareCode, setShareCode] = useState("");
  const [note, setNote] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // SEARCH NOTE
  // ==========================================

  const searchNote = async (e) => {
    e.preventDefault();

    const code = shareCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter a Note ID.");
      return;
    }

    setLoading(true);
    setError("");
    setNote(null);

    try {
      console.log("Searching for note:", code);

      // IMPORTANT:
      // Backend route is:
      // GET /notes/share/{share_code}

      const response = await api.get(
        `/notes/share/${encodeURIComponent(code)}`
      );

      console.log("Note found:", response.data);

      setNote(response.data);

    } catch (err) {
      console.error("Failed to find note:", err);

      if (err.response?.status === 404) {
        setError(
          "No note was found with that Note ID. Please check the code and try again."
        );
      } else if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
          "Unable to retrieve the note."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

        <div className="max-w-5xl mx-auto">

          {/* ========================================== */}
          {/* HEADER */}
          {/* ========================================== */}

          <div className="mb-8">

            <p className="text-blue-400 font-semibold mb-2">
              Learning Materials
            </p>

            <h1 className="text-3xl md:text-4xl font-black">
              Find a Note 📚
            </h1>

            <p className="text-gray-400 mt-2">
              Enter the Note ID provided by your teacher.
            </p>

          </div>


          {/* ========================================== */}
          {/* SEARCH BOX */}
          {/* ========================================== */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <form
              onSubmit={searchNote}
              className="flex flex-col md:flex-row gap-3"
            >

              <input
                type="text"
                value={shareCode}
                onChange={(e) => {
                  setShareCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Enter Note ID e.g. EDP-VM50SU"
                className="flex-1 px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
              >
                {loading
                  ? "Searching..."
                  : "Search Note 🔎"}
              </button>

            </form>


            {/* ERROR */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

          </div>


          {/* ========================================== */}
          {/* NOTE RESULT */}
          {/* ========================================== */}

          {note && (

            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

              {/* ====================================== */}
              {/* NOTE HEADER */}
              {/* ====================================== */}

              <div className="p-6 md:p-8 border-b border-white/10">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  <div>

                    <p className="text-sm text-blue-400 font-semibold">
                      Note ID
                    </p>

                    <p className="text-lg font-bold text-white mt-1">
                      {note.note_id}
                    </p>

                    <h2 className="text-2xl md:text-3xl font-black mt-4">
                      {note.title}
                    </h2>

                  </div>


                  {/* MATERIAL TYPE */}

                  <span className="self-start px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm capitalize">
                    {note.note_type?.replaceAll("_", " ")}
                  </span>

                </div>


                {/* CREATOR + DATE */}

                <div className="flex flex-wrap gap-4 mt-6">

                  {note.created_by && (
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">
                        Created by:
                      </span>{" "}
                      <span className="text-gray-300">
                        {note.created_by}
                      </span>
                    </div>
                  )}


                  {note.created_at && (
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">
                        Created:
                      </span>{" "}
                      <span className="text-gray-300">
                        {new Date(
                          note.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                </div>

              </div>


              {/* ====================================== */}
              {/* NOTE CONTENT */}
              {/* ====================================== */}

              <div className="p-6 md:p-8">

                <div className="mb-4">

                  <h3 className="text-lg font-bold text-white">
                    📖 Note Content
                  </h3>

                </div>


                <div className="bg-[#080d18] border border-white/10 rounded-xl p-6">

                  {note.content ? (

                    <div className="whitespace-pre-wrap leading-8 text-gray-200">
                      {note.content}
                    </div>

                  ) : (

                    <p className="text-gray-500">
                      This note does not contain any content.
                    </p>

                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}