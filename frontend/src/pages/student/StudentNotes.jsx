import { useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function StudentNotes() {
  const [noteId, setNoteId] = useState("");
  const [note, setNote] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // SEARCH NOTE
  // ==========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setNote(null);

    const cleanedId = noteId.trim().toUpperCase();

    // ==========================================
    // VALIDATE NOTE ID
    // ==========================================

    if (!cleanedId) {
      setError("Please enter the Note ID given to you by your teacher.");
      return;
    }

    if (!cleanedId.startsWith("EDP-")) {
      setError(
        "Invalid Note ID. Your Note ID should look like EDP-VM50SU."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Searching for note:",
        cleanedId
      );

      // ==========================================
      // SEARCH BACKEND
      // ==========================================

      const response = await api.get(
        `/notes/share/${cleanedId}`
      );

      console.log(
        "Note found:",
        response.data
      );

      setNote(response.data);

      setSuccess(
        "Note found successfully!"
      );

    } catch (err) {
      console.error(
        "Failed to find note:",
        err
      );

      if (err.response?.status === 404) {
        setError(
          "Note not found. Please check the Note ID and try again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to retrieve the note. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR NOTE
  // ==========================================

  const clearNote = () => {
    setNote(null);
    setSuccess("");
    setError("");
    setNoteId("");
  };

  return (
    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="max-w-5xl mx-auto">

          <div className="mb-10">

            <p className="text-blue-400 font-semibold mb-2">
              Learning Resources
            </p>

            <h1 className="text-3xl md:text-4xl font-black">
              Teacher Notes 📚
            </h1>

            <p className="text-gray-400 mt-2">
              Enter the Note ID provided by your teacher
              to access the learning material.
            </p>

          </div>


          {/* ========================================== */}
          {/* SEARCH CARD */}
          {/* ========================================== */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Find Shared Learning Material
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Your teacher should give you a Note ID
                in this format:
              </p>

              <div className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold tracking-wider">
                EDP-XXXXXX
              </div>

            </div>


            {/* ========================================== */}
            {/* SEARCH FORM */}
            {/* ========================================== */}

            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3"
            >

              <input
                type="text"
                value={noteId}
                onChange={(e) => {
                  setNoteId(
                    e.target.value.toUpperCase()
                  );

                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter Note ID e.g. EDP-VM50SU"
                maxLength={10}
                className="flex-1 px-4 py-4 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-blue-500 transition tracking-wider"
              />


              <button
                type="submit"
                disabled={loading}
                className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
              >

                {loading
                  ? "Searching..."
                  : "Find Note 🔍"}

              </button>

            </form>

          </div>


          {/* ========================================== */}
          {/* ERROR */}
          {/* ========================================== */}

          {error && (

            <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  ⚠️
                </span>

                <p className="text-red-400">
                  {error}
                </p>

              </div>

            </div>

          )}


          {/* ========================================== */}
          {/* SUCCESS */}
          {/* ========================================== */}

          {success && note && (

            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">

              <p className="text-green-400 font-medium">
                ✅ {success}
              </p>

            </div>

          )}


          {/* ========================================== */}
          {/* NOTE */}
          {/* ========================================== */}

          {note && (

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

              {/* ====================================== */}
              {/* NOTE HEADER */}
              {/* ====================================== */}

              <div className="p-6 md:p-8 border-b border-white/10">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  <div>

                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                        📘
                      </div>

                      <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase">
                        {note.note_type?.replace(
                          /_/g,
                          " "
                        )}
                      </span>

                    </div>


                    <h2 className="text-2xl md:text-3xl font-black">
                      {note.title}
                    </h2>


                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">

                      <span>
                        👨‍🏫 {note.created_by}
                      </span>

                      {note.created_at && (

                        <span>
                          📅{" "}
                          {new Date(
                            note.created_at
                          ).toLocaleDateString()}
                        </span>

                      )}

                    </div>

                  </div>


                  {/* NOTE ID */}

                  <div className="bg-black/30 border border-white/10 rounded-xl px-5 py-3">

                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Note ID
                    </p>

                    <p className="text-lg font-black text-blue-400 tracking-wider">
                      {note.note_id}
                    </p>

                  </div>

                </div>

              </div>


              {/* ====================================== */}
              {/* NOTE CONTENT */}
              {/* ====================================== */}

              <div className="p-6 md:p-8">

                <div className="flex items-center justify-between mb-5">

                  <h3 className="text-lg font-bold">
                    Learning Material
                  </h3>

                  <button
                    type="button"
                    onClick={clearNote}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
                  >
                    Search Another
                  </button>

                </div>


                <div className="rounded-xl bg-[#080d18] border border-white/5 p-6">

                  {note.content ? (

                    <div className="whitespace-pre-wrap leading-8 text-gray-200">
                      {note.content}
                    </div>

                  ) : (

                    <div className="text-center py-12">

                      <div className="text-5xl mb-4">
                        📭
                      </div>

                      <p className="text-gray-400">
                        This learning material has no
                        content available.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}


          {/* ========================================== */}
          {/* INITIAL EMPTY STATE */}
          {/* ========================================== */}

          {!note && !loading && !error && (

            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

              <div className="text-6xl mb-5">
                🔑
              </div>

              <h2 className="text-2xl font-bold">
                Enter a Note ID
              </h2>

              <p className="text-gray-500 mt-3 max-w-md mx-auto">
                Ask your teacher for the Note ID of the
                learning material you want to access.
              </p>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}