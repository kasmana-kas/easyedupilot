import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function NoteViewer() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/notes/share/${noteId}`
      );

      setNote(response.data);

    } catch (err) {
      console.error("Failed to load note:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to load this note."
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>

        <div className="min-h-screen bg-[#050914] text-white flex flex-col items-center justify-center">

          <div className="text-6xl animate-pulse mb-5">
            📖
          </div>

          <h2 className="text-xl font-semibold">
            Loading note...
          </h2>

          <p className="text-gray-500 mt-2">
            Getting your learning material.
          </p>

        </div>

      </DashboardLayout>
    );
  }


  if (error) {
    return (
      <DashboardLayout>

        <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

          <button
            onClick={() =>
              navigate("/student/shared-notes")
            }
            className="mb-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            ← Back to Search
          </button>

          <div className="max-w-3xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>

        </div>

      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/student/shared-notes")
          }
          className="mb-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          ← Back to Notes
        </button>


        {/* NOTE */}

        <article className="max-w-4xl mx-auto">

          {/* HEADER */}

          <div className="bg-white/5 border border-white/10 rounded-t-2xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl">
                📘
              </div>

              <div>

                <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide">
                  Shared Learning Material
                </p>

                <span className="text-gray-500 text-xs">
                  Note ID: {note.note_id}
                </span>

              </div>

            </div>


            <h1 className="text-3xl md:text-4xl font-black">
              {note.title}
            </h1>


            <div className="flex flex-wrap gap-3 mt-5">

              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm capitalize">
                {note.note_type?.replace("_", " ")}
              </span>


              {note.created_at && (

                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
                  {new Date(
                    note.created_at
                  ).toLocaleDateString()}
                </span>

              )}

            </div>

          </div>


          {/* CONTENT */}

          <div className="bg-white/[0.03] border-x border-b border-white/10 rounded-b-2xl p-8 md:p-10">

            <div className="whitespace-pre-wrap leading-8 text-gray-200 text-[16px]">
              {note.content || "No content available."}
            </div>

          </div>

        </article>

      </div>

    </DashboardLayout>
  );
}