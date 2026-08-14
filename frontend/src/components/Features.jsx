const features = [
  {
    icon: "🤖",
    title: "AI Quiz Generator",
    text: "Generate quizzes instantly using AI."
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    text: "Monitor student performance with beautiful charts."
  },
  {
    icon: "📚",
    title: "Learning Modules",
    text: "Organize all your course materials in one place."
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    text: "Reward students through healthy competition."
  }
];

export default function Features() {
  return (
    <section className="py-24 px-10">

      <h2 className="text-5xl font-bold text-center mb-16">
        Features
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        {features.map((feature, index) => (

          <div
            key={index}
            className="bg-slate-900 rounded-2xl p-8 shadow-lg hover:scale-105 transition"
          >

            <div className="text-5xl">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold mt-6">
              {feature.title}
            </h3>

            <p className="text-gray-400 mt-4">
              {feature.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}