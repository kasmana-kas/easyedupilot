export default function Testimonials() {
  return (
    <section className="py-20 px-10 bg-slate-900">

      <h2 className="text-5xl font-bold text-center mb-12">
        Testimonials
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-slate-800 p-8 rounded-2xl">
          ⭐⭐⭐⭐⭐
          <p className="mt-4">
            EasyEduPilot has transformed the way I teach.
          </p>

          <h4 className="mt-5 font-bold">
            John • Lecturer
          </h4>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          ⭐⭐⭐⭐⭐
          <p className="mt-4">
            AI quiz generation saves me hours every week.
          </p>

          <h4 className="mt-5 font-bold">
            Sarah • Teacher
          </h4>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          ⭐⭐⭐⭐⭐
          <p className="mt-4">
            The best learning platform I've used.
          </p>

          <h4 className="mt-5 font-bold">
            Abdul • Student
          </h4>
        </div>

      </div>

    </section>
  );
}