import { Upload, Sparkles, FileText, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    description:
      "Simply drag and drop your lecture notes, textbooks, or any study material in PDF format. We support files up to 100MB.",
    color: "bg-primary",
    iconColor: "text-primary-foreground",
  },
  {
    icon: Sparkles,
    title: "AI Generates Questions",
    description:
      "Our AI analyzes your content and creates customized practice questions — MCQs, short answers, and essay questions tailored to your difficulty level.",
    color: "bg-warning",
    iconColor: "text-warning-foreground",
  },
  {
    icon: FileText,
    title: "LaTeX-Quality PDF Output",
    description:
      "Receive a professionally typeset exam rendered with LaTeX. Clean formatting, proper mathematical notation, and print-ready quality.",
    color: "bg-success",
    iconColor: "text-success-foreground",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-muted/30 py-24"
    >
      {/* Decorative elements */}
      <div className="absolute left-10 top-20 h-3 w-3 rounded-full bg-primary/40" />
      <div className="absolute right-20 top-32 h-2 w-2 rounded-full bg-warning/50" />
      <div className="absolute bottom-20 left-1/4 h-4 w-4 rotate-45 bg-primary/20" />
      <div className="absolute bottom-32 right-10 h-3 w-3 rounded-full bg-success/40" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transform your lecture PDFs into professional practice exams in three
            simple steps. Fast, intelligent, and beautifully formatted.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-primary/20 via-warning/20 to-success/20 lg:block" />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Step number badge - positioned above icon with more space */}
                <div className="mb-3 text-sm font-semibold text-muted-foreground">
                  Step {index + 1}
                </div>

                {/* Icon container */}
                <div
                  className={`relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <step.icon className={`h-9 w-9 ${step.iconColor}`} />
                  
                  {/* Decorative ring */}
                  <div className="absolute -inset-2 rounded-3xl border-2 border-dashed border-muted-foreground/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Content card */}
                <div className="rounded-xl bg-background p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector - only on desktop between items */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-10 hidden text-muted-foreground/30 lg:block">
                    <svg
                      width="32"
                      height="24"
                      viewBox="0 0 32 24"
                      fill="none"
                      className="opacity-50"
                    >
                      <path
                        d="M0 12h28m0 0l-6-6m6 6l-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Download className="h-4 w-4 text-primary" />
            <span>
              Download your exam instantly — no account required for first use
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
