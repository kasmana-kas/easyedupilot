import DashboardLayout from "../../layouts/DashboardLayout";

export default function Modules() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <p className="text-purple-400 font-semibold mb-2">
            Teacher Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Modules 📚
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your teaching modules and subjects.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">

          <div className="text-6xl mb-5">
            📚
          </div>

          <h2 className="text-2xl font-bold">
            Modules
          </h2>

          <p className="text-gray-500 mt-3">
            Module management will appear here.
          </p>

        </div>

      </div>
    </DashboardLayout>
  );
}