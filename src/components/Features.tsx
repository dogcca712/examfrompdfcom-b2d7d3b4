import { 
  Brain, 
  FileOutput, 
  Clock, 
  Lock, 
  Sliders, 
  BookOpen 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Question Generation",
    description: "Our advanced AI analyzes your content and creates diverse, relevant questions that test real understanding.",
  },
  {
    icon: FileOutput,
    title: "LaTeX-Quality Output",
    description: "Professional typesetting with proper mathematical notation, clean formatting, and print-ready quality.",
  },
  {
    icon: Sliders,
    title: "Customizable Difficulty",
    description: "Choose your difficulty level and question types — MCQs, short answers, or essay questions.",
  },
  {
    icon: Clock,
    title: "Instant Generation",
    description: "Get your practice exam in seconds, not hours. Upload, configure, and download immediately.",
  },
  {
    icon: BookOpen,
    title: "Answer Key Included",
    description: "Every exam comes with a comprehensive answer key to help you study effectively.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your documents are processed securely and never stored permanently on our servers.",
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
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Ace Your Exams
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our AI exam generator combines cutting-edge technology with professional formatting 
            to create the perfect practice experience.
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
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
