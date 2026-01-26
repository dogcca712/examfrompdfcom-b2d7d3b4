import { Brain, FileOutput, Clock, Lock, Sliders, BookOpen } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Quiz Generator from PDF",
    description:
      "Our AI quiz generator analyzes your lecture PDF and creates relevant practice questions that test real understanding, not just memorization.",
  },
  {
    icon: FileOutput,
    title: "Print-Ready PDF Output",
    description:
      "Every PDF exam generator output is professionally formatted with clean layouts and proper mathematical notation, ready to print or share.",
  },
  {
    icon: Sliders,
    title: "Multiple Question Types",
    description:
      "This practice test maker supports MCQs, short answers, and essay questions. Choose the format that fits your study goals.",
  },
  {
    icon: Clock,
    title: "Fast Exam Processing",
    description:
      "Upload your PDF and receive a complete practice exam in seconds. No waiting, no complex setup required.",
  },
  {
    icon: BookOpen,
    title: "Built for Education",
    description:
      "Designed for students and teachers who need a reliable online exam tool, with structured questions and clear answers.",
  },
  {
    icon: Lock,
    title: "No Signup Required",
    description:
      "Start generating practice exams immediately. Your documents are processed securely and never stored on our servers.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Features
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, Clean, No Nonsense</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We focus on doing one thing well: turning your lecture PDFs into professional practice exams. No bloat, no
            complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
