import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeacherNotes() {
  const [mode, setMode] = useState("manual");

  // =====================================================
  // MANUAL FORM
  // =====================================================

  const [manualForm, setManualForm] = useState({
    topic: "",
    content: "",
    material_type: "note",
  });

  // =====================================================
  // AI FORM
  // =====================================================

  const [aiForm, setAiForm] = useState({
    topic: "",
    material_type: "notes",
    difficulty: "beginner",
  });

  // =====================================================
  // UPLOAD FORM
  // =====================================================

  const [uploadForm, setUploadForm] = useState({
    title: "",
    material_type: "study_material",
    file: null,
  });

  // =====================================================
  // STATES
  // =====================================================

  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createdNote, setCreatedNote] = useState(null);

  const [myNotes, setMyNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [selectedNote, setSelectedNote] = useState(null);

  // =====================================================
  // LOAD TEACHER'S SAVED NOTES
  // =====================================================

  const loadMyNotes = async () => {
    try {
      setLoadingNotes(true);

      const response = await api.get("/notes/my");

      console.log(
        "Teacher notes:",
        response.data
      );

      setMyNotes(
        response.data.notes || []
      );

    } catch (err) {
      console.error(
        "Failed to load teacher notes:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load your learning materials."
      );

    } finally {
      setLoadingNotes(false);
    }
  };

  // =====================================================
  // LOAD NOTES WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadMyNotes();
  }, []);

  // =====================================================
  // HANDLE MANUAL FORM
  // =====================================================

  const handleManualChange = (e) => {
    const { name, value } = e.target;

    setManualForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // HANDLE AI FORM
  // =====================================================

  const handleAIChange = (e) => {
    const { name, value } = e.target;

    setAiForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // HANDLE UPLOAD FORM
  // =====================================================

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setUploadForm((previous) => ({
        ...previous,
        file: files[0] || null,
      }));
    } else {
      setUploadForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    }

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CREATE MANUAL NOTE
  // =====================================================

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setCreatedNote(null);

    if (!manualForm.topic.trim()) {
      setError(
        "Please enter a note topic/title."
      );
      return;
    }

    if (!manualForm.content.trim()) {
      setError(
        "Please enter the note content."
      );
      return;
    }

    try {
      setCreating(true);

      const payload = {
        topic: manualForm.topic.trim(),
        content: manualForm.content.trim(),
        material_type: manualForm.material_type,
      };

      console.log(
        "Creating manual note:",
        payload
      );

      const response = await api.post(
        "/notes/",
        payload
      );

      console.log(
        "Manual note created:",
        response.data
      );

      setCreatedNote(response.data);

      setSuccess(
        response.data.message ||
        "Note created successfully."
      );

      setManualForm({
        topic: "",
        content: "",
        material_type: "note",
      });

      // Refresh saved materials
      await loadMyNotes();

    } catch (err) {
      console.error(
        "Failed to create note:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to create the note."
      );

    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // GENERATE AI MATERIAL
  // =====================================================

  const handleAISubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setCreatedNote(null);

    if (!aiForm.topic.trim()) {
      setError(
        "Please enter a topic for the AI."
      );
      return;
    }

    try {
      setGenerating(true);

      const payload = {
        topic: aiForm.topic.trim(),
        material_type: aiForm.material_type,
        difficulty: aiForm.difficulty,
      };

      console.log(
        "Generating AI material:",
        payload
      );

      const response = await api.post(
        "/ai/materials/generate",
        payload
      );

      console.log(
        "AI material generated:",
        response.data
      );

      // IMPORTANT:
      // The backend must return:
      //
      // note_id
      // title
      // content
      // note_type
      //
      setCreatedNote(response.data);

      setSuccess(
        response.data.message ||
        "AI learning material generated successfully."
      );

      setAiForm({
        topic: "",
        material_type: "notes",
        difficulty: "beginner",
      });

      // Refresh saved materials
      await loadMyNotes();

    } catch (err) {
      console.error(
        "Failed to generate AI material:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to generate AI learning material."
      );

    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
  // UPLOAD STUDY MATERIAL
  // =====================================================

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!uploadForm.title.trim()) {
      setError(
        "Please enter a title for the study material."
      );
      return;
    }

    if (!uploadForm.file) {
      setError(
        "Please select a study material file."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "title",
        uploadForm.title.trim()
      );

      formData.append(
        "material_type",
        uploadForm.material_type
      );

      formData.append(
        "file",
        uploadForm.file
      );

      /*
       * IMPORTANT:
       * This endpoint must exist on your backend.
       *
       * Example:
       * POST /notes/upload
       */

      const response = await api.post(
        "/notes/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Study material uploaded:",
        response.data
      );

      setCreatedNote(response.data);

      setSuccess(
        response.data.message ||
        "Study material uploaded successfully."
      );

      setUploadForm({
        title: "",
        material_type: "study_material",
        file: null,
      });

      // Reset file input visually
      const fileInput =
        document.getElementById(
          "study-material-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadMyNotes();

    } catch (err) {
      console.error(
        "Failed to upload study material:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to upload study material."
      );

    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // COPY SHARE CODE
  // =====================================================

  const copyNoteId = async (noteId = null) => {
    const code =
      noteId ||
      createdNote?.note_id;

    if (!code) return;

    try {
      await navigator.clipboard.writeText(
        String(code)
      );

      setSuccess(
        "Share code copied to clipboard!"
      );

    } catch (err) {
      console.error(
        "Failed to copy share code:",
        err
      );
    }
  };

  // =====================================================
  // VIEW SAVED NOTE
  // =====================================================

  const viewNote = async (note) => {
    try {
      setError("");

      /*
       * Fetch the complete note from the backend.
       */

      const response = await api.get(
        `/notes/my/${note.note_id}`
      );

      console.log(
        "Selected note:",
        response.data
      );

      setSelectedNote(
        response.data
      );

    } catch (err) {
      console.error(
        "Failed to load note:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to open this learning material."
      );
    }
  };

  return (
    <DashboardLayout>

      <div className="min-h-screen bg-[#050914] text-white p-6 md:p-10">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-10">

          <p className="text-purple-400 font-semibold mb-2">
            Teacher Resources
          </p>

          <h1 className="text-3xl md:text-4xl font-black">
            Learning Resources 📚
          </h1>

          <p className="text-gray-400 mt-2">
            Create notes, generate AI learning material,
            upload study materials, and share them with
            your students.
          </p>

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}


        {/* ================================================= */}
        {/* CREATED MATERIAL PREVIEW */}
        {/* ================================================= */}

        {createdNote && (
          <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 overflow-hidden">

            <div className="p-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                  ✅
                </div>

                <div className="flex-1">

                  <h2 className="text-xl font-bold text-green-400">
                    Resource Created Successfully
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Review the material below before
                    sharing it with your students.
                  </p>


                  {/* TITLE */}

                  <h3 className="text-2xl font-bold mt-6">
                    {createdNote.title}
                  </h3>


                  {/* TYPE */}

                  {createdNote.note_type && (
                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm capitalize">
                      {createdNote.note_type.replace(
                        /_/g,
                        " "
                      )}
                    </span>
                  )}


                  {/* SHARE CODE */}

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">

                    <div className="bg-black/30 border border-white/10 rounded-xl px-5 py-3">

                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Share Code
                      </p>

                      <p className="text-2xl font-black text-white">
                        {createdNote.note_id}
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        copyNoteId()
                      }
                      className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold transition"
                    >
                      📋 Copy Share Code
                    </button>

                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* ACTUAL CONTENT */}
              {/* ================================================= */}

              {createdNote.content ? (

                <div className="mt-8">

                  <div className="flex items-center justify-between mb-3">

                    <h3 className="text-lg font-bold">
                      📖 Material Preview
                    </h3>

                  </div>

                  <div className="bg-[#050914] border border-white/10 rounded-2xl p-6 md:p-8">

                    <div className="whitespace-pre-wrap leading-8 text-gray-200">
                      {createdNote.content}
                    </div>

                  </div>

                </div>

              ) : (

                <div className="mt-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-yellow-400">
                  The resource was created, but the
                  backend did not return its content.
                </div>

              )}

            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* RESOURCE TYPE SELECTOR */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* MANUAL */}

          <button
            type="button"
            onClick={() => {
              setMode("manual");
              setError("");
              setSuccess("");
              setCreatedNote(null);
            }}
            className={`text-left p-5 rounded-2xl border transition ${
              mode === "manual"
                ? "bg-purple-600/20 border-purple-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >

            <div className="text-3xl mb-3">
              ✍️
            </div>

            <h2 className="font-bold text-lg">
              Create Manual Note
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Write your own notes and share them
              with students.
            </p>

          </button>


          {/* AI */}

          <button
            type="button"
            onClick={() => {
              setMode("ai");
              setError("");
              setSuccess("");
              setCreatedNote(null);
            }}
            className={`text-left p-5 rounded-2xl border transition ${
              mode === "ai"
                ? "bg-blue-600/20 border-blue-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >

            <div className="text-3xl mb-3">
              🤖
            </div>

            <h2 className="font-bold text-lg">
              Generate with AI
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Let EasyEduPilot AI create learning
              material for your students.
            </p>

          </button>


          {/* UPLOAD */}

          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setError("");
              setSuccess("");
              setCreatedNote(null);
            }}
            className={`text-left p-5 rounded-2xl border transition ${
              mode === "upload"
                ? "bg-green-600/20 border-green-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >

            <div className="text-3xl mb-3">
              📤
            </div>

            <h2 className="font-bold text-lg">
              Upload Study Material
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Upload PDFs, documents and other
              study resources.
            </p>

          </button>

        </div>


        {/* ================================================= */}
        {/* MANUAL FORM */}
        {/* ================================================= */}

        {mode === "manual" && (

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Create Manual Note ✍️
              </h2>

              <p className="text-gray-400 mt-2">
                Write a note that your students can
                access using the share code.
              </p>

            </div>


            <form onSubmit={handleManualSubmit}>

              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Note Topic / Title
                </label>

                <input
                  type="text"
                  name="topic"
                  value={manualForm.topic}
                  onChange={handleManualChange}
                  placeholder="e.g. Introduction to Python"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-purple-500"
                />

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Material Type
                </label>

                <select
                  name="material_type"
                  value={manualForm.material_type}
                  onChange={handleManualChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-purple-500"
                >

                  <option value="note">
                    Note
                  </option>

                  <option value="study_material">
                    Study Material
                  </option>

                  <option value="lecture">
                    Lecture
                  </option>

                </select>

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Content
                </label>

                <textarea
                  name="content"
                  value={manualForm.content}
                  onChange={handleManualChange}
                  rows={12}
                  placeholder="Write your learning material here..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-purple-500 resize-none"
                />

              </div>


              <button
                type="submit"
                disabled={creating}
                className="w-full px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
              >

                {creating
                  ? "Creating..."
                  : "Create Note 📚"}

              </button>

            </form>

          </div>

        )}


        {/* ================================================= */}
        {/* AI FORM */}
        {/* ================================================= */}

        {mode === "ai" && (

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Generate Learning Material 🤖
              </h2>

              <p className="text-gray-400 mt-2">
                Enter a topic and let AI create the
                learning material automatically.
              </p>

            </div>


            <form onSubmit={handleAISubmit}>

              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Topic
                </label>

                <input
                  type="text"
                  name="topic"
                  value={aiForm.topic}
                  onChange={handleAIChange}
                  placeholder="e.g. Computer Networks"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-blue-500"
                />

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Material Type
                </label>

                <select
                  name="material_type"
                  value={aiForm.material_type}
                  onChange={handleAIChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-blue-500"
                >

                  <option value="notes">
                    Notes
                  </option>

                  <option value="summary">
                    Summary
                  </option>

                  <option value="flashcards">
                    Flashcards
                  </option>

                  <option value="study_guide">
                    Study Guide
                  </option>

                  <option value="explanation">
                    Simple Explanation
                  </option>

                </select>

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={aiForm.difficulty}
                  onChange={handleAIChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-blue-500"
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


              <button
                type="submit"
                disabled={generating}
                className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
              >

                {generating
                  ? "🤖 AI is generating..."
                  : "✨ Generate Learning Material"}

              </button>

            </form>

          </div>

        )}


        {/* ================================================= */}
        {/* UPLOAD FORM */}
        {/* ================================================= */}

        {mode === "upload" && (

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Upload Study Material 📤
              </h2>

              <p className="text-gray-400 mt-2">
                Upload a study document that your
                students can access using a share code.
              </p>

            </div>


            <form onSubmit={handleUploadSubmit}>

              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Material Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleUploadChange}
                  placeholder="e.g. Computer Networks Lecture Slides"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-green-500"
                />

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Material Type
                </label>

                <select
                  name="material_type"
                  value={uploadForm.material_type}
                  onChange={handleUploadChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-white outline-none focus:border-green-500"
                >

                  <option value="study_material">
                    Study Material
                  </option>

                  <option value="lecture">
                    Lecture
                  </option>

                  <option value="document">
                    Document
                  </option>

                  <option value="slides">
                    Slides
                  </option>

                </select>

              </div>


              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  File
                </label>

                <input
                  id="study-material-file"
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={handleUploadChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 text-gray-300"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Supported: PDF, Word, PowerPoint and
                  text documents.
                </p>

              </div>


              <button
                type="submit"
                disabled={uploading}
                className="w-full px-6 py-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
              >

                {uploading
                  ? "📤 Uploading..."
                  : "📤 Upload Study Material"}

              </button>

            </form>

          </div>

        )}


        {/* ================================================= */}
        {/* MY SAVED MATERIALS */}
        {/* ================================================= */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-purple-400 font-semibold">
                Your Resources
              </p>

              <h2 className="text-2xl font-bold mt-1">
                My Learning Materials 📚
              </h2>

            </div>

            <button
              type="button"
              onClick={loadMyNotes}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
            >
              🔄 Refresh
            </button>

          </div>


          {loadingNotes && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
              Loading your learning materials...
            </div>
          )}


          {!loadingNotes &&
            myNotes.length === 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">

                <div className="text-5xl mb-4">
                  📚
                </div>

                <h3 className="text-xl font-bold">
                  No learning materials yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Create a note or generate material
                  with AI and it will appear here.
                </p>

              </div>
            )}


          {!loadingNotes &&
            myNotes.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {myNotes.map((note) => (

                  <div
                    key={note.note_id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span className="text-xs text-purple-400 uppercase tracking-wider">
                          {note.note_type?.replace(
                            /_/g,
                            " "
                          )}
                        </span>

                        <h3 className="text-xl font-bold mt-2">
                          {note.title}
                        </h3>

                      </div>

                      <span className="text-xs text-gray-500">
                        {note.created_at
                          ? new Date(
                              note.created_at
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>


                    {/* SHARE CODE */}

                    <div className="mt-5 bg-black/20 border border-white/10 rounded-xl p-4">

                      <p className="text-xs text-gray-500">
                        SHARE CODE
                      </p>

                      <p className="font-bold text-blue-400 mt-1">
                        {note.note_id}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          viewNote(note)
                        }
                        className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition"
                      >
                        👁 View Content
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyNoteId(
                            note.note_id
                          )
                        }
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                      >
                        📋 Copy
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>


        {/* ================================================= */}
        {/* NOTE VIEWER MODAL */}
        {/* ================================================= */}

        {selectedNote && (

          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0b1220] border border-white/10 rounded-2xl shadow-2xl">

              {/* MODAL HEADER */}

              <div className="sticky top-0 bg-[#0b1220] border-b border-white/10 p-6 flex items-center justify-between gap-4">

                <div>

                  <p className="text-purple-400 text-sm font-semibold uppercase">
                    {selectedNote.note_type?.replace(
                      /_/g,
                      " "
                    )}
                  </p>

                  <h2 className="text-2xl font-black mt-1">
                    {selectedNote.title}
                  </h2>

                  <p className="text-sm text-blue-400 mt-1">
                    {selectedNote.note_id}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedNote(null)
                  }
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-xl"
                >
                  ✕
                </button>

              </div>


              {/* MODAL CONTENT */}

              <div className="p-6 md:p-8">

                {selectedNote.content ? (

                  <div className="whitespace-pre-wrap leading-8 text-gray-200 text-[16px]">
                    {selectedNote.content}
                  </div>

                ) : (

                  <div className="text-gray-500 text-center py-10">
                    This material does not contain text
                    content.
                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}