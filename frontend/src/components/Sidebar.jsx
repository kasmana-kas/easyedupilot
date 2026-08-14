import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  // ==========================================
  // STUDENT NAVIGATION
  // ==========================================

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: "🏠",
    },
    {
      name: "My Notes",
      path: "/student/notes",
      icon: "📚",
    },
    {
      name: "AI Study Materials",
      path: "/student/ai-materials",
      icon: "🤖",
    },
    {
      name: "Quizzes",
      path: "/student/quizzes",
      icon: "📝",
    },
    {
      name: "My Results",
      path: "/student/results",
      icon: "📊",
    },
  ];

  // ==========================================
  // TEACHER NAVIGATION
  // ==========================================

  const teacherLinks = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: "🏠",
    },
    {
      name: "Departments",
      path: "/teacher/departments",
      icon: "🏢",
    },
    {
      name: "Modules",
      path: "/teacher/modules",
      icon: "📚",
    },
    {
      name: "Notes",
      path: "/teacher/notes",
      icon: "📖",
    },
    {
      name: "Create Quiz",
      path: "/teacher/create-quiz",
      icon: "📝",
    },
    {
      name: "Generate AI Quiz",
      path: "/teacher/generate-quiz",
      icon: "🤖",
    },
    {
      name: "Results",
      path: "/teacher/results",
      icon: "📊",
    },
  ];

  const links =
    user?.role === "teacher"
      ? teacherLinks
      : studentLinks;

  return (
    <aside className="h-screen flex flex-col bg-[#050914]">

      {/* ========================================== */}
      {/* LOGO */}
      {/* ========================================== */}

      <div className="h-20 px-6 flex items-center border-b border-white/10 shrink-0">

        <div className="flex items-center gap-3">

          <img
            src="/easyedupilot-logo.png"
            alt="EasyEduPilot"
            className="w-10 h-10 object-contain"
          />

          <div>

            <h1 className="font-bold text-white">
              EasyEduPilot
            </h1>

            <p className="text-xs text-gray-500">
              AI Learning Platform
            </p>

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* NAVIGATION */}
      {/* ========================================== */}

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">

        <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-4">
          {user?.role === "teacher"
            ? "Teaching"
            : "Learning"}
        </p>


        {links.map((link) => (

          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >

            <span className="text-xl w-6 text-center">
              {link.icon}
            </span>

            <span className="font-medium">
              {link.name}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* ========================================== */}
      {/* USER SECTION */}
      {/* ========================================== */}

      <div className="p-4 border-t border-white/10 shrink-0">

        <div className="bg-white/5 rounded-xl p-4">

          <p className="text-sm font-semibold text-white truncate">

            {user?.first_name || "User"}{" "}

            {user?.last_name || ""}

          </p>

          <p className="text-xs text-gray-500 mt-1 capitalize">
            {user?.role || "student"}
          </p>

        </div>

      </div>

    </aside>
  );
}