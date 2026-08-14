import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


/* =========================================================
   STUDENT
========================================================= */

import StudentDashboard from "../pages/StudentDashboard";

import AIMaterials
  from "../pages/student/AIMaterials";

import StudentQuizzes
  from "../pages/student/StudentQuizzes";

import Quiz
  from "../pages/student/Quiz";

import MyResults
  from "../pages/student/MyResults";

import StudentNotes
  from "../pages/student/StudentNotes";

import NoteViewer
  from "../pages/student/NoteViewer";

import SharedNote
  from "../pages/student/SharedNote";


/* =========================================================
   TEACHER
========================================================= */

import TeacherDashboard
  from "../pages/teacher/Dashboard";

import GenerateQuiz
  from "../pages/teacher/GenerateQuiz";

import CreateQuiz
  from "../pages/teacher/CreateQuiz";

import TeacherQuizView
  from "../pages/teacher/TeacherQuizView";

import TeacherQuizResults
  from "../pages/teacher/TeacherQuizResults";

import TeacherResults
  from "../pages/teacher/Results";

import Departments
  from "../pages/teacher/Departments";

import Modules
  from "../pages/teacher/Modules";

import TeacherNotes
  from "../pages/teacher/TeacherNotes";


function AppRoutes() {

  return (

    <Routes>


      {/* ================================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================================= */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================================================= */}
      {/* STUDENT ROUTES */}
      {/* ================================================= */}

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />


      <Route
        path="/student/ai-materials"
        element={<AIMaterials />}
      />


      <Route
        path="/student/quizzes"
        element={<StudentQuizzes />}
      />


      <Route
        path="/student/quiz/:quizId"
        element={<Quiz />}
      />


      <Route
        path="/student/results"
        element={<MyResults />}
      />


      <Route
        path="/student/notes"
        element={<StudentNotes />}
      />


      <Route
        path="/student/notes/:noteId"
        element={<NoteViewer />}
      />


      <Route
        path="/student/shared-note/:shareCode"
        element={<SharedNote />}
      />


      {/* ================================================= */}
      {/* TEACHER DASHBOARD */}
      {/* ================================================= */}

      <Route
        path="/teacher/dashboard"
        element={<TeacherDashboard />}
      />


      {/* ================================================= */}
      {/* TEACHER CREATE QUIZ */}
      {/* ================================================= */}

      <Route
        path="/teacher/create-quiz"
        element={<CreateQuiz />}
      />


      {/* ================================================= */}
      {/* TEACHER AI QUIZ */}
      {/* ================================================= */}

      <Route
        path="/teacher/generate-quiz"
        element={<GenerateQuiz />}
      />


      {/* ================================================= */}
      {/* TEACHER QUIZ VIEW */}
      {/* ================================================= */}

      <Route
        path="/teacher/quizzes/:quizId"
        element={<TeacherQuizView />}
      />


      {/* ================================================= */}
      {/* TEACHER QUIZ RESULTS */}
      {/* ================================================= */}

      <Route
        path="/teacher/quizzes/:quizId/results"
        element={<TeacherQuizResults />}
      />


      {/* ================================================= */}
      {/* ALL TEACHER RESULTS */}
      {/* ================================================= */}

      <Route
        path="/teacher/results"
        element={<TeacherResults />}
      />


      {/* ================================================= */}
      {/* TEACHER DEPARTMENTS */}
      {/* ================================================= */}

      <Route
        path="/teacher/departments"
        element={<Departments />}
      />


      {/* ================================================= */}
      {/* TEACHER MODULES */}
      {/* ================================================= */}

      <Route
        path="/teacher/modules"
        element={<Modules />}
      />


      {/* ================================================= */}
      {/* TEACHER NOTES */}
      {/* ================================================= */}

      <Route
        path="/teacher/notes"
        element={<TeacherNotes />}
      />


      {/* ================================================= */}
      {/* FALLBACK */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );

}


export default AppRoutes;